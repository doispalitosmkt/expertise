# Guia para o Codex — Expertise

> Como usar o Codex (ou qualquer AI de código) para criar novas páginas e editar seções
> mantendo o padrão visual da Expertise.

---

## Regras Absolutas (nunca violar)

1. **Nunca usar `font-weight: 800` ou `600`** — Typekit Degular só tem 400 e 700
2. **Nunca usar cores fora da paleta** — sempre via `var(--yellow)`, `var(--ink)`, etc.
3. **Nunca usar font-family "Degular" (maiúsculo)** — usar `"degular"` (minúsculo)
4. **Nunca criar font-face local para Degular** — vem do Typekit `ucv5oiz`
5. **Nunca usar `font-weight: 800` em itálicos** — usar `font-family: "Editor"` + `font-style: italic`
6. **Prototype é single-file** — todo CSS e JS fica dentro do `index.html`
7. **Nunca usar React/Vue/etc** — HTML/CSS/JS vanilla puro

---

## Prompt Base para Criar uma Nova Página

Use este prompt como ponto de partida ao pedir ao Codex para criar uma nova página:

```
Crie uma página HTML single-file para a Expertise Agência de Live Marketing.

REGRAS DE DESIGN OBRIGATÓRIAS:
- Fonte Degular via Typekit: <link rel="stylesheet" href="https://use.typekit.net/ucv5oiz.css">
  font-family: "degular" (texto), "degular-display" (títulos grandes)
  Apenas font-weight: 400 e 700. NUNCA 800 ou 600.
- Fonte Editor para itálicos editoriais: @font-face local de assets/fonts/Editor-*.otf
  Usar em: .section-title em { font-family:"Editor"; font-style:italic; }
- Paleta: --yellow:#ffea00 | --ink:#000000 | --dark:#212121 | --paper:#e2e2e2 | --white:#ffffff | --yellow-soft:#fff292
- Container: width: min(1240px, calc(100% - 40px)); margin-inline: auto
- Seções escuras: background var(--dark), texto var(--white), destaque var(--yellow)
- Seções amarelas: background var(--yellow), texto var(--ink)
- Logo: <img src="assets/logo.svg"> com filter:brightness(0) invert(1) no escuro / filter:brightness(0) no claro
- X decorativo de fundo: <img class="brand-x-deco" src="assets/x-mark.svg" aria-hidden="true" alt="">
- Animações de entrada: data-reveal="up|left|right|fade" com IntersectionObserver
- Itálico de títulos: <em> dentro de .section-title → font-family:"Editor", font-style:italic

ESTRUTURA DO <HEAD>:
<link rel="stylesheet" href="https://use.typekit.net/ucv5oiz.css">
+ @font-face para Editor Regular/Italic/Bold/BoldItalic

Consulte docs/DESIGN-SYSTEM.md para tokens e componentes completos.
```

---

## Prompt para Adicionar uma Nova Seção

```
Adicione uma seção de [NOME] ao index.html da Expertise seguindo o padrão:
- Fundo: [escuro (var(--dark)) | amarelo (var(--yellow)) | claro (var(--yellow-soft))]
- ID da section: [id="nome-secao"]
- Inclui: eyebrow, section-title com <em> itálico, lead, [descrição do conteúdo]
- Todos os elementos com data-reveal="up"
- Se fundo amarelo: adicionar <img class="brand-x-deco" src="assets/x-mark.svg" aria-hidden="true" alt="">
- Botões: classe .button (primário) ou .button.secondary (outline)

Consulte docs/DESIGN-SYSTEM.md seção "7. Padrões de Seção".
```

---

## Prompt para Adicionar uma Animação

```
Adicione animação de [DESCRIÇÃO] na seção [NOME] do index.html.

REGRAS:
- Usar CSS @keyframes + transition (sem bibliotecas externas)
- Usar var(--ease) = cubic-bezier(0.4,0,0.2,1) para eases
- Trigger via IntersectionObserver (já existe no script, adicionar data-reveal="up")
  ou via JS na seção do script (entre os comentários de seção existentes)
- Animações de hover: transition máx 0.3s
- Animações de entrada: duration 0.7–0.9s com delay cascateado (0.1s, 0.2s, 0.3s...)
- Não usar requestAnimationFrame a menos que seja animação contínua (ex: canvas)
- Performance: usar transform e opacity — NUNCA animar width, height, top, left diretamente

Consulte docs/DESIGN-SYSTEM.md seção "9. Animações CSS".
```

---

## Prompt para Editar uma Seção Existente

```
Edite a seção [ID_DA_SECTION] no index.html da Expertise.

Alterações:
- [Descreva exatamente o que quer mudar]

MANTER sem alterar:
- Paleta de cores (vars CSS)
- Font-families e weights
- Estrutura de .container
- Sistema de data-reveal
- Logo filter behavior
```

---

## Seções da Homepage e seus IDs

| Seção | ID / Classe | Fundo | Localização no HTML |
|---|---|---|---|
| Hero | `.hero` | `--yellow` + canvas partículas | ~linha 1730 |
| Brand Band (marquee) | `.brand-band` | `--dark` | ~linha 1775 |
| Quem Somos | `#quem-somos` | `--dark` | ~linha 1800 |
| Expertises | `#expertises` | `--yellow-soft` | ~linha 1870 |
| Clientes | `#clients` | `--dark` | ~linha 1960 |
| Cases | `#cases` | `--dark` | ~linha 1990 |
| Blog | `#blog` | `--dark` | ~linha 2060 |
| FAQ | `#faq` | `--dark` | ~linha 2130 |
| CTA / Contato | `#contato` | `--yellow` | ~linha 2190 |
| Footer | `.footer` | `--yellow` | ~linha 2210 |

---

## JS já disponível no index.html (não reescrever)

```javascript
// Reveal on scroll — ativa classe .visible nos [data-reveal]
IntersectionObserver → data-reveal="up|left|right|fade"

// Counter animation — anima números ao entrar na tela
[data-count="26"] [data-suffix="+"]  →  conta de 0 até 26+

// FAQ smooth toggle — details/summary com animação
document.querySelectorAll('details')

// Nav link active state
sections → navLinks highlight automático ao scroll

// Nav light mode
nav.classList.toggle('nav--light', !pastHero)
// Quando sobre o hero/seções amarelas → logo preto, fundo transparente

// Hero particle canvas
#hero-canvas → rede de partículas com mouse interaction
```

---

## Checklist ao Criar/Editar

- [ ] `<link>` do Typekit no `<head>`
- [ ] `@font-face` para Editor no `<style>`
- [ ] Todos os `font-weight` são 400 ou 700
- [ ] Cores via `var(--nome)`, não hex direta
- [ ] Títulos com `class="section-title"` e `data-reveal="up"`
- [ ] Itálicos em `<em>` dentro do `.section-title` (virará Editor italic automaticamente)
- [ ] Botões com classe `.button` ou `.button.secondary`
- [ ] Imagens com `loading="lazy"` (exceto hero)
- [ ] Ícones SVG com `aria-hidden="true"` e `alt=""`
- [ ] Logo com filtro CSS correto para o fundo da seção
- [ ] Seções com `class="section"` + `id` único
- [ ] Elementos interativos com `transition` adequada

---

## Convenções de Nomenclatura

```css
/* Seções */
.section.nome-secao { }

/* Elementos internos da seção */
.nome-secao-title { }
.nome-secao-grid  { }
.nome-secao-card  { }
.nome-secao-cta   { }

/* Modificadores */
.button.secondary     /* variante outline do botão */
.brand-logo--dark     /* logo escuro */
.nav--light           /* nav em modo claro */
```

---

## Como Adicionar uma Nova Página (além de index.html)

Para novas páginas (ex: `cases.html`, `sobre.html`):

1. Copiar o `<head>` completo do `index.html` (fonts, Typekit, tokens CSS, reset)
2. Copiar o bloco `<nav>` completo
3. Copiar o bloco `<footer>` completo
4. Copiar o bloco `<script>` completo (nav, reveal, counters)
5. Ajustar caminhos de assets: `../assets/` se a página estiver em subpasta

```html
<!-- Estrutura mínima de nova página -->
<!doctype html>
<html lang="pt-BR">
<head>
  <!-- [COLAR HEAD DO INDEX.HTML] -->
</head>
<body>
  <!-- [COLAR NAV DO INDEX.HTML] -->
  <main>
    <!-- Seções da nova página -->
  </main>
  <!-- [COLAR FOOTER DO INDEX.HTML] -->
  <script>
    <!-- [COLAR SCRIPT DO INDEX.HTML] -->
  </script>
</body>
</html>
```
