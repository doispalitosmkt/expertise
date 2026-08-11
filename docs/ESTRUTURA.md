# Estrutura do Projeto — Expertise Protótipo

> Protótipo HTML single-file destinado a importação no Figma e referência visual para o Codex.
> Todo o CSS e JS vive dentro de `index.html`. Não existe build step, bundler ou framework.

---

## Árvore de Arquivos

```
claude_prototipo_novo/
│
├── index.html                  ← ÚNICO ARQUIVO FONTE (HTML + CSS + JS inline)
│
├── assets/
│   ├── logo.svg                ← Logotipo completo "expertise" (wordmark + X)
│   ├── x-mark.svg              ← Só o X da marca (decoração de fundo nas seções)
│   │
│   ├── fonts/
│   │   ├── Editor-Regular.otf      ← Fonte Editorial (serif), usada em títulos itálicos
│   │   ├── Editor-Italic.otf       ← Editor itálico
│   │   ├── Editor-Bold.otf         ← Editor bold
│   │   ├── Editor-BoldItalic.otf   ← Editor bold+itálico
│   │   │
│   │   ├── Degular-*.otf           ← ⚠️ NÃO USADOS — versão Demo substituída pelo Typekit
│   │   └── (os Degular-*.otf podem ser deletados com segurança)
│   │
│   ├── icons/
│   │   ├── icon-arrow-down.svg
│   │   ├── icon-arrow-up.svg
│   │   ├── icon-bookmark.svg
│   │   ├── icon-cart.svg
│   │   ├── icon-chat.svg
│   │   ├── icon-clock.svg          ← usado no proof-strip (anos de experiência)
│   │   ├── icon-enter.svg
│   │   ├── icon-external-link.svg  ← usado no proof-strip (projetos realizados)
│   │   ├── icon-gift.svg           ← usado no proof-strip (prêmios)
│   │   ├── icon-heart.svg          ← usado no proof-strip (marcas atendidas)
│   │   ├── icon-home.svg
│   │   ├── icon-location.svg
│   │   ├── icon-search.svg
│   │   ├── icon-send.svg
│   │   ├── icon-sun.svg
│   │   ├── icon-trash.svg
│   │   ├── icon-truck.svg
│   │   └── icon-user.svg
│   │
│   └── images/
│       ├── hero-stage.jpg          ← ⚠️ NÃO USADA no novo hero (4.5 MB — pode remover)
│       ├── about-team.jpg          ← Seção Quem Somos
│       ├── activation.jpg          ← Seção Expertises / cases
│       ├── video-call.jpg          ← Seção Blog (mockup laptop)
│       ├── project-cases.jpg       ← Card de case
│       ├── project-convention.jpg  ← Card de case
│       ├── project-event.jpg       ← Card de case
│       ├── project-trade.jpg       ← Card de case
│       ├── logo-bridgestone.jpg    ← Seção Clientes
│       ├── logo-castrol.jpg        ← Seção Clientes
│       ├── logo-coty.jpg           ← Seção Clientes
│       ├── logo-fini.jpg           ← Seção Clientes
│       ├── logo-nestle.jpg         ← Seção Clientes
│       ├── logo-terra.jpg          ← Seção Clientes
│       └── logo-vivo.jpg           ← Seção Clientes
│
├── docs/                           ← DOCUMENTAÇÃO (esta pasta)
│   ├── ESTRUTURA.md               ← Este arquivo
│   ├── DESIGN-SYSTEM.md           ← Tokens, cores, tipografia, componentes
│   └── CODEX-GUIDE.md             ← Como usar o Codex mantendo o padrão
│
└── .claude/
    └── launch.json                 ← Config do servidor de preview (porta 3333)
```

---

## Fonte de Verdade da Identidade Visual

Os assets originais da marca ficam em:
```
C:\Users\flori\Desktop\expertise\NOVA_ID_EXPERTISE\
│
├── logotipo\logotipo.svg           ← Logo SVG master (FONTE OFICIAL)
├── Iconografia\icon-*.svg          ← Ícones originais da marca
├── Fonts\editor-font-family\       ← Fonte Editor completa (todos os pesos)
├── Fonts\degular-font-family\      ← Degular Demo (não usar — usar Typekit)
├── Elementos Gráficos\             ← .ai com elementos gráficos da marca
├── Composicoes\                    ← .ai com composições
├── GRID\                           ← Sistema de grid em .ai
├── Proposta Visual\                ← PDF + fotos da proposta visual
└── Stickers\                       ← .ai com stickers
```

---

## Estrutura Interna do `index.html`

O arquivo tem ~2.450 linhas divididas em blocos:

| Linhas (aprox.) | Conteúdo |
|---|---|
| 1–8 | `<head>` — charset, viewport, título, link Typekit |
| 9–40 | `@font-face` — Editor Regular/Italic/Bold/BoldItalic |
| 41–61 | `:root` — CSS Custom Properties (tokens de design) |
| 62–100 | Reset, scrollbar, seleção de texto |
| 101–220 | Componentes base: nav, botões, eyebrow, lead |
| 221–380 | Tipografia: section-title, hero-title, animações |
| 381–650 | Hero: canvas, badge, wordmark, tagline, CTA, proof-strip |
| 651–850 | Brand Band (marquee), Quem Somos |
| 851–1100 | Expertises (unit cards) |
| 1101–1300 | Clientes (client logos) |
| 1301–1500 | Cases (project cards) |
| 1501–1700 | Blog (article cards) |
| 1701–1900 | FAQ (details/summary) |
| 1901–2000 | CTA section + Footer |
| 2001–2100 | Responsive (@media) |
| 2100–2200 | HTML: nav, main sections |
| 2200–2460 | `<script>` — nav, reveal, counters, FAQ, partículas |

---

## Servidor de Preview

```bash
# Iniciar o servidor (porta 3333 por padrão)
npx serve .

# A config .claude/launch.json aponta para porta 3333
# Se a porta estiver ocupada, matar o processo:
#   Windows: netstat -ano | findstr :3333 → taskkill /PID <id> /F
```
