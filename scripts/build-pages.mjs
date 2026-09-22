import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);

function readArgument(name, fallback) {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  if (!args[index + 1]) throw new Error(`O argumento ${name} precisa de um valor.`);
  return args[index + 1];
}

function normalizeBasePath(value) {
  if (!value || value === "/") return "";
  const validBasePath = /^\/(?!\/)[A-Za-z0-9._~-]+(?:\/[A-Za-z0-9._~-]+)*\/?$/;
  const segments = value.replace(/^\/+|\/+$/g, "").split("/");

  if (!validBasePath.test(value) || segments.some((segment) => segment === "." || segment === "..")) {
    throw new Error(
      "O base path deve começar com uma única / e conter apenas segmentos de URL seguros.",
    );
  }
  return value.replace(/\/$/, "");
}

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });
}

function publicUrlForFile(file) {
  const filePath = relative(outputDirectory, file).split(sep).join("/");
  return `https://pages.local${basePath}/${filePath}`;
}

function assertLocalTarget(url, sourceFile) {
  if (!url || /^(?:#|[a-z][a-z\d+.-]*:|\/\/)/i.test(url)) return;

  const resolvedUrl = new URL(url, publicUrlForFile(sourceFile));
  if (resolvedUrl.origin !== "https://pages.local") return;

  const expectedPrefix = `${basePath}/`;
  if (basePath && resolvedUrl.pathname !== basePath && !resolvedUrl.pathname.startsWith(expectedPrefix)) {
    throw new Error(`URL fora do base path em ${relative(projectRoot, sourceFile)}: ${url}`);
  }

  let targetPath = decodeURIComponent(resolvedUrl.pathname.slice(basePath.length)).replace(/^\/+/, "");
  if (!targetPath || targetPath.endsWith("/")) targetPath += "index.html";

  const target = join(outputDirectory, targetPath);
  if (!existsSync(target)) {
    throw new Error(`Referência pública ausente em ${relative(projectRoot, sourceFile)}: ${url}`);
  }
}

function validateArtifact() {
  const files = listFiles(outputDirectory);
  const forbiddenName =
    /(^|\/)(?:\.env(?:\.|$)|.*\.(?:key|pem|p12|pfx|kdbx)|credentials?(?:\.|$)|secrets?(?:\.|$)|id_(?:rsa|ed25519)(?:\.|$))/i;
  let checkedUrls = 0;

  for (const file of files) {
    const artifactPath = relative(outputDirectory, file).split(sep).join("/");
    const metadata = lstatSync(file);

    if (metadata.isSymbolicLink() || (metadata.isFile() && metadata.nlink > 1)) {
      throw new Error(`O artefato não pode conter links simbólicos ou físicos: ${artifactPath}`);
    }

    if (forbiddenName.test(artifactPath)) {
      throw new Error(`Arquivo sensível não permitido no artefato: ${artifactPath}`);
    }

    const hasUnexpectedDotfile =
      artifactPath !== ".nojekyll" && artifactPath.split("/").some((segment) => segment.startsWith("."));
    if (hasUnexpectedDotfile) {
      throw new Error(`Dotfile não permitido no artefato: ${artifactPath}`);
    }

    const extension = extname(file).toLowerCase();
    if (extension !== ".html" && extension !== ".css") continue;
    const contents = readFileSync(file, "utf8");

    if (extension === ".html") {
      if (noIndex && !/<meta\s+name=["']robots["']\s+content=["']noindex, nofollow["']\s*>/i.test(contents)) {
        throw new Error(`Proteção noindex ausente: ${artifactPath}`);
      }

      for (const match of contents.matchAll(/\b(?:href|src|poster|action|formaction)\s*=\s*["']([^"']+)["']/gi)) {
        assertLocalTarget(match[1], file);
        checkedUrls += 1;
      }
    } else {
      for (const match of contents.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
        assertLocalTarget(match[1].trim(), file);
        checkedUrls += 1;
      }
    }
  }

  return { files: files.length, checkedUrls };
}

const outputDirectory = resolve(readArgument("--output", join(projectRoot, "_site")));
const basePath = normalizeBasePath(readArgument("--base-path", ""));
const noIndex = args.includes("--noindex");

if (outputDirectory === projectRoot) {
  throw new Error("O diretório de saída não pode ser a raiz do projeto.");
}

if (existsSync(outputDirectory) && readdirSync(outputDirectory).length > 0) {
  throw new Error(`O diretório de saída precisa estar vazio: ${outputDirectory}`);
}

const publicEntries = [
  "index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "assets",
  "blog",
];

mkdirSync(outputDirectory, { recursive: true });

for (const entry of publicEntries) {
  const source = join(projectRoot, entry);
  if (!existsSync(source)) throw new Error(`Entrada pública ausente: ${entry}`);
  cpSync(source, join(outputDirectory, entry), { recursive: statSync(source).isDirectory() });
}

let rewrittenUrls = 0;
let protectedDocuments = 0;

for (const file of listFiles(outputDirectory)) {
  const extension = extname(file).toLowerCase();
  if (extension !== ".html" && extension !== ".css") continue;

  const original = readFileSync(file, "utf8");
  let transformed = original;

  if (extension === ".html") {
    if (noIndex) {
      if (/<meta\s+name=["']robots["'][^>]*>/i.test(transformed)) {
        transformed = transformed.replace(
          /<meta\s+name=["']robots["'][^>]*>/i,
          '<meta name="robots" content="noindex, nofollow">',
        );
      } else {
        transformed = transformed.replace(
          /<head>/i,
          '<head>\n  <meta name="robots" content="noindex, nofollow">',
        );
      }
      protectedDocuments += 1;
    }

    if (basePath) {
      transformed = transformed.replace(
        /(\b(?:href|src|poster|action|formaction)\s*=\s*["'])\/(?!\/)/gi,
        (match, attribute) => {
          rewrittenUrls += 1;
          return `${attribute}${basePath}/`;
        },
      );
    }
  }

  if (extension === ".css" && basePath) {
    transformed = transformed.replace(/(url\(\s*["']?)\/(?!\/)/gi, (match, opening) => {
      rewrittenUrls += 1;
      return `${opening}${basePath}/`;
    });
  }

  if (transformed !== original) writeFileSync(file, transformed);
}

writeFileSync(join(outputDirectory, ".nojekyll"), "");

if (noIndex) {
  writeFileSync(join(outputDirectory, "robots.txt"), "User-agent: *\nDisallow:\n");
}

const validation = validateArtifact();

console.log(
  `GitHub Pages: ${validation.files} arquivos públicos; ${rewrittenUrls} URLs ajustadas para ${basePath || "/"}; ${validation.checkedUrls} referências validadas; ${protectedDocuments} documentos com noindex.`,
);
