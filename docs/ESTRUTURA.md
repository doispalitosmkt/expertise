# Estrutura do Projeto — Expertise

Este repositório é um site institucional estático e multipágina, feito com HTML, CSS e JavaScript nativos. Não há build obrigatório no desenvolvimento, bundler, framework, gerenciador de pacotes ou geração de páginas: cada rota pública corresponde a um arquivo HTML versionado. A publicação no GitHub Pages tem apenas uma etapa de empacotamento para adaptar o subcaminho do ambiente de demonstração.

## Árvore principal

```text
.
├── index.html
├── 404.html
├── quem-somos/index.html
├── nossas-expertises/index.html
├── servicos/index.html
├── cases/index.html
├── cases/terra-na-parada-lgbtqia/index.html
├── blog/index.html
├── faca-parte/index.html
├── contato/index.html
├── politica-de-privacidade/index.html
├── .github/workflows/pages.yml
├── scripts/build-pages.mjs
├── assets/
│   ├── css/
│   │   ├── tokens.css
│   │   ├── site.css
│   │   └── pages/
│   │       ├── home.css
│   │       ├── internal.css
│   │       ├── case-overlay.css
│   │       ├── case-detail.css
│   │       ├── services.css
│   │       └── forms.css
│   ├── js/
│   │   ├── site.js
│   │   ├── home.js
│   │   ├── case-catalog.js
│   │   ├── case-overlay.js
│   │   └── forms.js
│   ├── fonts/
│   ├── icons/
│   ├── images/
│   ├── logo.svg
│   └── x-mark.svg
├── docs/
│   ├── CODEX-GUIDE.md
│   ├── DESIGN-SYSTEM.md
│   └── ESTRUTURA.md
├── robots.txt
└── sitemap.xml
```

## Rotas implementadas

| Rota | Arquivo | Papel |
|---|---|---|
| `/` | [`index.html`](../index.html) | Homepage |
| `/quem-somos/` | [`quem-somos/index.html`](../quem-somos/index.html) | Institucional e template canônico das páginas internas |
| `/nossas-expertises/` | [`nossas-expertises/index.html`](../nossas-expertises/index.html) | Unidades de negócio e atuação integrada |
| `/servicos/` | [`servicos/index.html`](../servicos/index.html) | Catálogo granular de serviços, competências transversais e aplicações em cases |
| `/cases/` | [`cases/index.html`](../cases/index.html) | Catálogo de 29 cases em quatro núcleos; aceita `?case=slug` para abrir o detalhe sobreposto |
| `/cases/terra-na-parada-lgbtqia/` | [`cases/terra-na-parada-lgbtqia/index.html`](../cases/terra-na-parada-lgbtqia/index.html) | Template de detalhe de case preenchido com conteúdo real do projeto Terra |
| `/blog/` | [`blog/index.html`](../blog/index.html) | Arquivo editorial |
| `/faca-parte/` | [`faca-parte/index.html`](../faca-parte/index.html) | Candidatura em modo de pré-visualização |
| `/contato/` | [`contato/index.html`](../contato/index.html) | Contato em modo de pré-visualização |
| `/politica-de-privacidade/` | [`politica-de-privacidade/index.html`](../politica-de-privacidade/index.html) | Política de privacidade |
| Erro 404 | [`404.html`](../404.html) | Página não encontrada |

As rotas canônicas publicadas também devem permanecer sincronizadas em [`sitemap.xml`](../sitemap.xml). O arquivo [`robots.txt`](../robots.txt) aponta para esse sitemap. Mudanças de URL exigem redirecionamento configurado no provedor de hospedagem antes da publicação.

## Camadas de CSS

A ordem de carregamento é parte do contrato:

1. [`assets/css/tokens.css`](../assets/css/tokens.css): fontes locais e custom properties globais.
2. [`assets/css/site.css`](../assets/css/site.css): reset, base, container, botões, header, menu mobile, reveal e footer.
3. Um stylesheet de página em [`assets/css/pages/`](../assets/css/pages/):
   - [`home.css`](../assets/css/pages/home.css) para a homepage;
   - [`internal.css`](../assets/css/pages/internal.css) para páginas internas e 404;
   - [`case-detail.css`](../assets/css/pages/case-detail.css), depois de `internal.css`, para páginas individuais de case;
   - [`services.css`](../assets/css/pages/services.css), depois de `internal.css`, somente para o catálogo de Serviços;
   - [`forms.css`](../assets/css/pages/forms.css), depois de `internal.css`, somente nas páginas com formulário.

4. [`assets/css/pages/case-overlay.css`](../assets/css/pages/case-overlay.css) depois do stylesheet de página nas telas que abrem cases: Home, Cases e Serviços.

Regras compartilhadas pertencem a `site.css`; regras exclusivas de uma família de páginas pertencem ao arquivo correspondente em `pages/`. Não duplicar os estilos globais dentro do HTML.

## Camadas de JavaScript

- [`assets/js/site.js`](../assets/js/site.js): comportamento compartilhado — estado do header, menu mobile com controle de foco, item de navegação atual, reveal por `IntersectionObserver`, player sob demanda com YouTube sem cookies e ano corrente.
- [`assets/js/home.js`](../assets/js/home.js): comportamento exclusivo da homepage — barra de progresso `#progress`, abertura breve `.home-intro` uma vez por sessão, título com troca de palavras `[data-hero-words]`, contadores `[data-count]` e controle `[data-motion-toggle]`. Respeita redução de movimento e pausa as trocas quando o título ou a aba deixam de estar visíveis.
- [`assets/js/case-catalog.js`](../assets/js/case-catalog.js): fonte estruturada dos 29 cases, incluindo textos, métricas verificadas, vídeos e mídia local otimizada.
- [`assets/js/case-overlay.js`](../assets/js/case-overlay.js): monta o catálogo e abre detalhes em um `<dialog>` de tela cheia. Intercepta somente links `[data-case-overlay]`, preserva links normais como fallback, controla histórico, Escape, foco, rolagem e reprodução de vídeo sob demanda.
- [`assets/js/forms.js`](../assets/js/forms.js): validação local dos formulários de preview, mensagens acessíveis e regras do arquivo de currículo.

Os scripts são carregados com `defer`. Uma página interna comum usa apenas `site.js`; a homepage adiciona `home.js`; Contato e Faça Parte adicionam `forms.js`.

## Header, menu mobile e footer canônicos

Use [`quem-somos/index.html`](../quem-somos/index.html) como referência canônica para:

- skip link para `#conteudo`;
- header `#nav`, logo e navegação desktop;
- botão `#menu-btn`;
- painel `#mobile-menu`, botão `#menu-close` e navegação mobile;
- CTA de Contato no header;
- footer completo, contatos, redes, links legais e marca final.

Esses blocos dependem dos IDs, atributos ARIA e `data-site-nav` atuais. Ao criar uma página, copie-os sem alterar a estrutura. Mudanças globais de navegação ou footer devem ser aplicadas de forma consistente em todas as páginas.

Cada documento deve ter `<body data-page="slug-da-rota">` e `<main id="conteudo">`. O `site.js` define `aria-current="page"` comparando o caminho atual aos links de `[data-site-nav]`.

## Assets e caminhos

Os HTMLs usam caminhos absolutos a partir da raiz, como `/assets/logo.svg` e `/assets/css/site.css`. Por isso, o projeto deve ser servido por HTTP com a raiz do repositório como document root; abrir um HTML diretamente com `file://` não reproduz o ambiente correto.

- `assets/fonts/`: Plus Jakarta Sans e VT323 em WOFF2, com as respectivas licenças SIL OFL 1.1; Editor (itálico 400/700) em WOFF2, com licença "Personal Use Only" da BeFonts — ver `Editor-BeFonts-License.txt`.
- `assets/icons/`: iconografia SVG.
- `assets/images/`: imagens da homepage, cases, blog, clientes e decoração.
- `assets/logo.svg`: assinatura principal.
- `assets/x-mark.svg`: símbolo da marca e favicon.

Imagens novas devem ser otimizadas, ter nome estável e ficar em uma subpasta coerente. Não fazer hotlink do site legado.

## Publicação no GitHub Pages

O workflow [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) publica automaticamente cada commit da `main`. Como o endereço de projeto do GitHub Pages usa o subcaminho `/expertise/`, [`scripts/build-pages.mjs`](../scripts/build-pages.mjs) monta um artefato em `_site/` e prefixa apenas na cópia publicada os caminhos absolutos de HTML e CSS. O código-fonte continua compatível com a raiz do domínio oficial.

Essa publicação é uma pré-visualização: o workflow acrescenta `noindex, nofollow` aos HTMLs do artefato e mantém o crawl permitido para que os robôs possam ler essa diretiva, sem mudar os arquivos editoriais do projeto. Remova `--noindex` do workflow apenas quando o Pages for configurado com o domínio oficial e a publicação definitiva estiver autorizada.

O artefato usa uma lista explícita de arquivos e pastas públicas. `docs/`, `.vscode/`, `.legacy-site-archive/`, configurações do Git e arquivos de referência não são enviados ao Pages. `_site/` é saída descartável e permanece ignorado pelo Git. Essa lista protege apenas o artefato publicado; como o repositório é público, nenhum arquivo interno ou sensível pode ser versionado, inclusive no histórico.

Para testar o empacotamento sem alterar o projeto:

```bash
destino=$(mktemp -d)
node scripts/build-pages.mjs --output "$destino" --base-path /expertise --noindex
```

## Conteúdo herdado

Materiais brutos do site anterior, inventários internos e arquivos de referência são mantidos fora deste repositório público e não são dependências de produção. Ao migrar ou criar conteúdo, use somente fontes aprovadas pelo responsável do projeto.

Antes de publicar informações herdadas, valide com o cliente números, certificações, equipe, serviços ativos, plataformas, contatos, direitos de imagem e textos legais.

## Formulários em modo de pré-visualização

Os formulários de [Contato](../contato/index.html) e [Faça Parte](../faca-parte/index.html) usam `data-preview-form`, `novalidate`, `forms.css` e `forms.js`.

No estado atual:

- a submissão é interceptada no navegador;
- os campos são validados localmente;
- nenhum dado ou arquivo é enviado, persistido ou encaminhado;
- o usuário recebe um status de sucesso ou erro;
- o currículo aceita PDF, DOC ou DOCX de até 10 MB apenas para validação local.

Não remover o aviso de pré-visualização enquanto não existirem backend, destinatário, segurança de upload, política de retenção, tratamento de erros e base legal aprovados.

## Preview local

Sirva a raiz do projeto e acesse:

```text
http://127.0.0.1:5500/
```

O Live Server do editor pode ser usado nessa porta. Como alternativa:

```bash
python3 -m http.server 5500 --bind 127.0.0.1
```

Confirme também as rotas internas diretamente, por exemplo `http://127.0.0.1:5500/quem-somos/`.
