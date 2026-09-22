"""Import the legacy WordPress blog into the local static content catalog.

Run manually with the bundled Python runtime. Pillow is required only to optimize
inline article images; the deployed site never contacts the legacy WordPress.
"""

from __future__ import annotations

import html
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
API_URL = "https://www.expertisegroup.com.br/wp-json/wp/v2/posts?per_page=100&_embed=1"
OUTPUT = ROOT / "content" / "blog-posts.json"
IMAGE_ROOT = ROOT / "assets" / "images" / "blog" / "posts"
USER_AGENT = "Expertise static blog importer/1.0"


POST_META = {
    "estrategias-de-live-marketing-para-lancamento-de-produtos": {
        "category": "Live Marketing",
        "accent": "lançamento de produtos",
        "cover": "/assets/images/blog/live-marketing.webp",
        "coverAlt": "Profissional usando um tablet cercada por ícones de interação digital",
        "excerpt": "Como transformar lançamentos em experiências ao vivo mais próximas, imediatas e relevantes para o público.",
    },
    "gamificacao-em-eventos-corporativos-tendencias-para-2025": {
        "category": "Eventos",
        "accent": "tendências para 2025",
        "cover": "/assets/images/blog/gamificacao.webp",
        "coverAlt": "Participantes conversando durante um evento corporativo",
        "excerpt": "Mecânicas de jogo ajudam a tornar encontros corporativos mais participativos sem perder de vista os objetivos do evento.",
    },
    "a-influencia-da-realidade-aumentada-em-experiencias-de-marca": {
        "category": "Inovação",
        "accent": "experiências de marca",
        "cover": "/assets/images/blog/realidade-aumentada-ar.webp",
        "coverAlt": "Pessoa usando realidade aumentada para explorar um produto em uma ativação",
        "excerpt": "Camadas digitais ampliam a interação entre pessoas, produtos e marcas e abrem novas possibilidades para experiências memoráveis.",
    },
    "carnaval-2025-oportunidades-para-marcas-no-live-marketing": {
        "category": "Live Marketing",
        "accent": "live marketing",
        "cover": "/assets/images/blog/carnaval-2025.webp",
        "coverAlt": "Pessoa fotografando uma fantasia colorida de Carnaval",
        "excerpt": "Ativações, promoções e lançamentos encontram no Carnaval um território potente para gerar presença e conexão em tempo real.",
    },
    "case-vencedor-do-premio-caio-nestle-60": {
        "category": "Cases e Prêmios",
        "accent": "Nestlé 60+",
        "cover": "/assets/images/blog/nestle-60.webp",
        "coverAlt": "Promotora da campanha Nestlé 60+ em um ponto de venda",
        "excerpt": "A operação nacional com promotores 60+ uniu inclusão, escala e resultado — e conquistou ouro no Prêmio Caio.",
    },
    "e-ouro-a-expertise-no-premio-caio": {
        "category": "Cases e Prêmios",
        "accent": "Prêmio Caio!",
        "cover": "/assets/images/blog/premio-caio.webp",
        "coverAlt": "Equipe Expertise reunida com os troféus do Prêmio Caio",
        "excerpt": "Em 2022, quatro troféus reconheceram projetos da Expertise em sustentabilidade, incentivo, cenografia e evento promocional.",
    },
    "a-expertise-foi-acompanhar-de-perto-a-expo-dubai-2022": {
        "category": "Tendências",
        "accent": "Expo Dubai 2022",
        "cover": "/assets/images/blog/expo-dubai.webp",
        "coverAlt": "Entrada da Expo 2020 Dubai",
        "excerpt": "Um olhar da equipe Expertise sobre os pavilhões, a tecnologia e as experiências multissensoriais apresentadas na Expo Dubai.",
    },
}


def fetch(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=45) as response:
        return response.read()


def plain_text(markup: str) -> str:
    value = re.sub(r"<[^>]+>", " ", markup)
    return re.sub(r"\s+", " ", html.unescape(value)).strip()


def safe_filename(url: str, used: set[str]) -> str:
    stem = Path(urllib.parse.urlparse(url).path).stem
    stem = re.sub(r"-\d+x\d+$", "", stem)
    stem = re.sub(r"[^a-zA-Z0-9]+", "-", stem).strip("-").lower() or "image"
    candidate = stem
    suffix = 2
    while candidate in used:
        candidate = f"{stem}-{suffix}"
        suffix += 1
    used.add(candidate)
    return f"{candidate}.webp"


def localize_images(slug: str, markup: str) -> str:
    urls = sorted(set(re.findall(r'https://www\.expertisegroup\.com\.br/wp-content/uploads/[^"\'\s>]+', markup)))
    if not urls:
        return markup

    destination = IMAGE_ROOT / slug
    destination.mkdir(parents=True, exist_ok=True)
    for stale_image in destination.glob("*.webp"):
        stale_image.unlink()
    used: set[str] = set()
    replacements: dict[str, str] = {}

    for url in urls:
        filename = safe_filename(url, used)
        output = destination / filename
        try:
            image = Image.open(BytesIO(fetch(url)))
            image = ImageOps.exif_transpose(image)
            image.thumbnail((2000, 2000), Image.Resampling.LANCZOS)
            if image.mode not in {"RGB", "RGBA"}:
                image = image.convert("RGBA" if "transparency" in image.info else "RGB")
            image.save(output, "WEBP", quality=84, method=6)
        except Exception as error:  # noqa: BLE001 - report the precise source URL
            raise RuntimeError(f"Could not import {url}: {error}") from error
        replacements[url] = f"/assets/images/blog/posts/{slug}/{filename}"

    for original, local in replacements.items():
        markup = markup.replace(original, local)
    return markup


def clean_markup(slug: str, markup: str, known_slugs: set[str]) -> str:
    markup = re.sub(r"<!--.*?-->", "", markup, flags=re.S)
    markup = re.sub(r'\s+(?:srcset|sizes)="[^"]*"', "", markup)
    markup = re.sub(r"\s+(?:srcset|sizes)='[^']*'", "", markup)
    markup = localize_images(slug, markup)
    markup = re.sub(r'\s+(?:class|style|decoding|loading)="[^"]*"', "", markup)
    markup = re.sub(r"\s+(?:class|style|decoding|loading)='[^']*'", "", markup)
    markup = markup.replace("https://www.youtube.com/embed/", "https://www.youtube-nocookie.com/embed/")

    for known_slug in known_slugs:
        legacy = f'https://www.expertisegroup.com.br/{known_slug}/'
        markup = markup.replace(legacy, f"/blog/{known_slug}/")

    markup = markup.replace('href="https://www.expertisegroup.com.br/"', 'href="/"')
    markup = re.sub(r"\n{3,}", "\n\n", markup).strip()
    if "expertisegroup.com.br" in markup:
        raise RuntimeError(f"Legacy Expertise URL remains in {slug}")
    return markup


def main() -> None:
    posts = json.loads(fetch(API_URL).decode("utf-8"))
    known_slugs = {post["slug"] for post in posts}
    unknown = known_slugs.difference(POST_META)
    if unknown:
        raise RuntimeError(f"Add editorial metadata for: {', '.join(sorted(unknown))}")

    catalog = []
    for post in posts:
        slug = post["slug"]
        meta = POST_META[slug]
        title = plain_text(post["title"]["rendered"])
        body_html = clean_markup(slug, post["content"]["rendered"], known_slugs)
        words = len(plain_text(body_html).split())
        catalog.append({
            "slug": slug,
            "title": title,
            "accent": meta["accent"],
            "date": post["date"][:10],
            "category": meta["category"],
            "readingMinutes": max(2, round(words / 180)),
            "excerpt": meta["excerpt"],
            "cover": meta["cover"],
            "coverAlt": meta["coverAlt"],
            "bodyHtml": body_html,
        })

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Imported {len(catalog)} posts into {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:  # noqa: BLE001
        print(error, file=sys.stderr)
        raise
