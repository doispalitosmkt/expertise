# Design System — Expertise

> Referência completa de tokens, tipografia, componentes e padrões visuais.
> Sempre consulte este arquivo antes de criar ou editar qualquer seção.

---

## 1. Paleta de Cores

```css
/* CSS Custom Properties — definidas em :root no index.html */

--yellow:      #ffea00;   /* Amarelo primário — Brand 01 */
--yellow-soft: #fff292;   /* Amarelo suave    — Brand 02 */
--yellow-deep: #e6d000;   /* Amarelo escuro (hover/detalhe) */
--ink:         #000000;   /* Preto puro       — Brand 03 */
--dark:        #212121;   /* Cinza muito escuro — Brand 04 */
--paper:       #e2e2e2;   /* Cinza claro      — Brand 05 */
--white:       #ffffff;   /* Branco           — Brand 06 */
--surface:     #212121;   /* Fundo de seção escura */
--surface-2:   #2a2a2a;   /* Variação de fundo escuro */
--muted:       #888888;   /* Texto secundário */
```

### Regras de uso

| Contexto | Fundo | Texto | Destaque |
|---|---|---|---|
| Hero | `--yellow` | `--ink` | `--ink` (botão) |
| Seções escuras (Quem Somos, Cases, Blog, FAQ) | `--dark` / `--surface` | `--white` | `--yellow` |
| Seções claras (Expertises) | `--yellow-soft` / `--paper` | `--ink` | `--yellow` |
| CTA | `--yellow` | `--ink` | `--ink` (botão) |
| Footer | `--yellow` | `--ink` | — |
| Proof strip (barra de números) | `#0e0e0e` | `--yellow` (números) / `--white` (labels) | — |
| Nav (sobre hero/CTA) | `transparent` | `--ink` | `--ink` (botão) |
| Nav (scrollada) | `--dark` | `--white` | `--yellow` (botão) |

---

## 2. Tipografia

### Fontes

```html
<!-- No <head> — OBRIGATÓRIO em toda página -->
<link rel="stylesheet" href="https://use.typekit.net/ucv5oiz.css">
```

```css
/* @font-face no <style> — OBRIGATÓRIO em toda página */
@font-face { font-family:"Editor"; src:url("assets/fonts/Editor-Regular.otf") format("opentype"); font-weight:400; font-style:normal; }
@font-face { font-family:"Editor"; src:url("assets/fonts/Editor-Italic.otf") format("opentype"); font-weight:400; font-style:italic; }
@font-face { font-family:"Editor"; src:url("assets/fonts/Editor-Bold.otf") format("opentype"); font-weight:700; font-style:normal; }
@font-face { font-family:"Editor"; src:url("assets/fonts/Editor-BoldItalic.otf") format("opentype"); font-weight:700; font-style:italic; }
```

### Famílias disponíveis

| font-family | Uso | Pesos disponíveis |
|---|---|---|
| `"degular", sans-serif` | Corpo de texto, UI geral | 400, 700 |
| `"degular-display", sans-serif` | Títulos grandes (section-title, hero) | 400, 700 |
| `"degular-text", sans-serif` | Texto corrido longo | 400, 700 |
| `"Editor", Georgia, serif` | Itálicos editoriais em títulos | 400 italic, 700 italic |

> ⚠️ Não usar `font-weight: 800` ou `font-weight: 600` — Typekit Degular só tem 400 e 700.

### Escala Tipográfica

```css
/* Título de seção */
.section-title {
  font-family: "degular-display", sans-serif;
  font-weight: 700;
  font-size: clamp(38px, 5.5vw, 82px);
  line-height: 0.92;
  letter-spacing: -0.025em;
}

/* Itálico editorial dentro de títulos */
.section-title em,
.hero-title em {
  font-family: "Editor", Georgia, serif;
  font-style: italic;
  font-weight: 400;
}

/* Wordmark hero */
.hero-wordmark {
  width: clamp(340px, 76vw, 960px);
}

/* Eyebrow (tag acima do título) */
.eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* Lead / subtítulo */
.lead {
  font-size: clamp(16px, 1.5vw, 19px);
  line-height: 1.65;
}
```

---

## 3. Espaçamento e Layout

```css
--max: 1240px;       /* largura máxima do container */
--radius: 10px;      /* border-radius padrão */
--radius-lg: 18px;   /* border-radius cards grandes */
```

```css
/* Container padrão */
.container {
  width: min(var(--max), calc(100% - 40px));
  margin-inline: auto;
}

/* Padding de seções */
.section { padding-block: 112px; }  /* desktop */
/* mobile (640px): padding-block: 86px */
```

---

## 4. Componentes

### Botão

```html
<!-- Primário (amarelo/preto) -->
<a class="button" href="#link">Label</a>

<!-- Secundário (outline) -->
<a class="button secondary" href="#link">Label</a>

<!-- Pill (arredondado — usado no hero) -->
<a class="button" style="border-radius:100px; padding:14px 36px;">Label ↗</a>
```

```css
/* Cores do botão mudam conforme o fundo da seção:
   - Seção escura: background=--yellow, color=--ink
   - Seção amarela (hero/CTA): background=--ink, color=--yellow
   Isso é controlado por seletores específicos de seção. */
```

### Eyebrow

```html
<span class="eyebrow">Tag da seção</span>
```

### Section Title

```html
<h2 class="section-title" data-reveal="up">
  Título da seção <em>com itálico editorial.</em>
</h2>
```

### Card de Case / Projeto

```html
<article class="project-card" data-reveal="up">
  <img src="assets/images/projeto.jpg" alt="Nome do projeto" loading="lazy">
  <div class="project-info">
    <span class="project-tag">Categoria</span>
    <h3 class="project-name">Nome do Projeto</h3>
  </div>
</article>
```

### Unit Card (Expertise)

```html
<div class="unit-card" data-reveal="up">
  <div class="unit-num">01</div>
  <div class="unit-body">
    <img class="unit-icon" src="assets/icons/icon-clock.svg" alt="">
    <h3 class="unit-name">Nome da Expertise</h3>
    <p class="unit-desc">Descrição da expertise.</p>
    <div class="unit-tags">
      <span class="tag">Tag 1</span>
      <span class="tag">Tag 2</span>
    </div>
  </div>
  <a class="unit-cta" href="#cases">Ver casos →</a>
</div>
```

### Brand X Decoration

```html
<!-- Elemento decorativo de fundo (X da marca) — seções CTA e Footer -->
<img class="brand-x-deco" src="assets/x-mark.svg" aria-hidden="true" alt="">

<!-- Customizações inline se necessário: -->
<img class="brand-x-deco" src="assets/x-mark.svg" aria-hidden="true" alt=""
     style="right:-40px; bottom:40px; opacity:0.07;">
```

```css
/* Posição padrão (canto inferior direito) */
.brand-x-deco {
  position: absolute;
  width: 560px;
  right: 4%;
  bottom: 60px;
  opacity: 0.14;
}
```

---

## 5. Sistema de Reveal (animação de entrada ao scroll)

Qualquer elemento pode ter animação de entrada adicionando `data-reveal`:

```html
data-reveal="up"    ← sobe de baixo (padrão — usar na maioria dos casos)
data-reveal="left"  ← entra da esquerda
data-reveal="right" ← entra da direita
data-reveal="fade"  ← só opacidade, sem movimento
```

O JS de reveal já está no `index.html` e usa `IntersectionObserver`. Não precisa escrever JS extra.

```html
<!-- Exemplo de seção completa com reveal -->
<h2 class="section-title" data-reveal="up">Título</h2>
<p class="lead" data-reveal="up">Subtítulo.</p>
<div class="card-grid" data-reveal="fade">
  ...
</div>
```

---

## 6. Logos e SVG

### Logotipo principal

```html
<!-- Branco (nav sobre fundo escuro) -->
<img src="assets/logo.svg" alt="Expertise" class="brand-logo">
<!-- CSS: filter: brightness(0) invert(1) -->

<!-- Preto (nav sobre fundo claro/amarelo, footer) -->
<img src="assets/logo.svg" alt="Expertise" class="brand-logo brand-logo--dark">
<!-- CSS: filter: brightness(0) -->
```

```css
.brand-logo            { filter: brightness(0) invert(1); } /* branco */
.brand-logo--dark      { filter: brightness(0); }           /* preto */
.nav.nav--light .brand-logo { filter: brightness(0); }      /* auto: sobre amarelo */
.footer .brand-logo    { filter: brightness(0); }           /* footer amarelo */
```

### Ícones da marca

```html
<!-- Ícone branco sobre fundo escuro -->
<img src="assets/icons/icon-clock.svg" alt="" style="filter:brightness(0) invert(1);">

<!-- Ícone amarelo -->
<img src="assets/icons/icon-clock.svg" alt=""
     style="filter:brightness(0) saturate(100%) invert(95%) sepia(100%) saturate(400%) hue-rotate(2deg);">

<!-- Ícone preto (padrão — nenhum filtro necessário) -->
<img src="assets/icons/icon-clock.svg" alt="">
```

---

## 7. Padrões de Seção

### Seção escura (padrão)

```html
<section class="section" id="nome-secao">
  <div class="container">
    <span class="eyebrow" data-reveal="up">Tag da seção</span>
    <h2 class="section-title" data-reveal="up">
      Título <em>em itálico.</em>
    </h2>
    <p class="lead" data-reveal="up">Subtítulo descritivo.</p>
    <!-- Conteúdo -->
  </div>
</section>
```

### Seção amarela/clara

```html
<section class="section nome-secao-light" id="nome-secao">
  <!-- Adicionar CSS: background: var(--yellow-soft) ou var(--yellow) -->
  <img class="brand-x-deco" src="assets/x-mark.svg" aria-hidden="true" alt="">
  <div class="container">
    <!-- Conteúdo — textos usam var(--ink) -->
  </div>
</section>
```

---

## 8. Hero Canvas (Partículas Interativas)

O hero usa um `<canvas>` com rede de partículas. Parâmetros no JS:

```javascript
const TOTAL     = 95;    // quantidade de nós
const LINK_DIST = 230;   // distância máxima para conectar (px)
const SPEED     = 0.55;  // velocidade base (px/frame)
const DRIFT     = 0.008; // taxa de mudança de direção
const MOUSE_R   = 240;   // raio de influência do mouse
```

Para ajustar o visual:
- **Mais denso**: aumentar `TOTAL` (100–120) e `LINK_DIST` (250+)
- **Mais lento**: diminuir `SPEED` (0.3–0.4)
- **Mais agitado com mouse**: aumentar o multiplicador `* 14` na linha `activeDrift`
- **Cor das partículas**: mudar `rgba(0,0,0,...)` — para fundo escuro usar `rgba(255,255,255,...)`

---

## 9. Animações CSS

```css
/* Ease padrão da marca */
--ease:     cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);

/* Animação de entrada (hero) */
@keyframes hero-up {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Uso: animation: hero-up 0.8s ease Xs both; (X = delay) */
/* Delays cascateados: 0.1s, 0.22s, 0.38s, 0.52s... */
```

```css
/* Transições padrão */
transition: all 0.3s var(--ease);      /* hover geral */
transition: background 0.3s ease;     /* hover de cor */
transition: opacity 0.3s ease;        /* hover de opacidade */
```
