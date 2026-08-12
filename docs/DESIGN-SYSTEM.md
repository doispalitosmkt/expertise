# Design System — Expertise

Este documento descreve o sistema visual que está implementado. A fonte de verdade executável é formada por [`tokens.css`](../assets/css/tokens.css), [`site.css`](../assets/css/site.css) e pelos estilos em [`assets/css/pages/`](../assets/css/pages/).

## Arquivos e precedência

Carregue os estilos nesta ordem:

```html
<link rel="stylesheet" href="/assets/css/tokens.css">
<link rel="stylesheet" href="/assets/css/site.css">
<link rel="stylesheet" href="/assets/css/pages/internal.css">
```

Na homepage, substitua `internal.css` por `home.css`. Em Serviços, carregue `services.css` depois de `internal.css`. Em Contato e Faça Parte, carregue `forms.css` depois de `internal.css`.

| Arquivo | Responsabilidade |
|---|---|
| [`tokens.css`](../assets/css/tokens.css) | Fontes locais, cores, tipografia, medidas, raios, sombras, duração e easing |
| [`site.css`](../assets/css/site.css) | Fundação global, acessibilidade, navegação, botões, reveal e footer |
| [`pages/home.css`](../assets/css/pages/home.css) | Composição aprovada da homepage |
| [`pages/internal.css`](../assets/css/pages/internal.css) | Hero, seções, cards e layouts reutilizados nas páginas internas |
| [`pages/services.css`](../assets/css/pages/services.css) | Navegação, capítulos e agrupamentos do catálogo de Serviços |
| [`pages/forms.css`](../assets/css/pages/forms.css) | Campos, consentimento, status e responsividade dos formulários |

## Tipografia

As fontes são locais e declaradas em `tokens.css`:

- `var(--font-sans)`: **Plus Jakarta Sans**, fonte principal de texto, navegação, interface e títulos.
- `var(--font-editorial)`: **Editor**, usada para ênfase editorial, normalmente em `<em>`.
- `var(--font-brand-credit)`: **VT323**, reservada à assinatura “2P Growth Lab” no rodapé.

Plus Jakarta Sans está disponível no intervalo de peso 400–700. Editor possui 400 e 700, normal e itálico. VT323 possui peso 400. Use os tokens de família, sem repetir listas de fallback em componentes.

Use `--font-weight-regular` (400) e `--font-weight-bold` (700) nos componentes. A Editor não possui peso intermediário nativo; não sintetize 500 ou 600.

Padrão de título editorial:

```html
<h2 class="section-title">
  Estratégia que se transforma em <em>presença.</em>
</h2>
```

`internal.css` aplica Editor itálica aos `<em>` de `.page-hero__title` e `.section-title`.

VT323 é um detalhe de marca da 2P e não deve ser aplicada a outros textos do site. No footer, mantenha “Desenvolvido por” na fonte principal e envolva somente “2P Growth Lab” em `.legal-credit__brand`.

## Paleta

| Token | Valor | Uso principal |
|---|---:|---|
| `--color-black` | `#000000` | Preto absoluto para sobreposições e máscaras visuais |
| `--color-ink` | `#0a0a0a` | Fundo principal e texto sobre áreas claras |
| `--color-ink-deep` a `--color-ink-hover` | `#0b0b0b` a `#1c1c1c` | Tons preservados de painéis e estados da homepage |
| `--color-ink-soft` | `#181818` | Cards escuros |
| `--color-surface` | `#212121` | Superfície escura secundária |
| `--color-surface-raised` | `#2a2a2a` | Superfície elevada |
| `--color-paper` | `#e2e2e2` | Seção clara institucional |
| `--color-white` | `#ffffff` | Texto e superfícies claras |
| `--color-muted` | `#a5a5a5` | Texto secundário |
| `--color-yellow` | `#ffea00` | Cor primária da marca e foco |
| `--color-yellow-soft` | `#fff292` | Variação clara da marca |
| `--color-yellow-deep` | `#d9c700` | Contraste e detalhes |
| `--color-danger` | `#c72f2f` | Erros de formulário |
| `--color-danger-ink` | `#8c1818` | Texto de erro sobre superfície clara |
| `--color-success` | `#147a4b` | Confirmação de formulário |
| `--color-success-ink` | `#0b5834` | Texto de sucesso sobre superfície clara |

Para linhas, use `--line-light` em superfícies escuras e `--line-dark` em superfícies claras. Cores opacas usam os tokens `--color-*`; transparências contextuais usam `rgb(var(--rgb-*) / alpha)`, preservando a mesma cor-base sem criar um token para cada opacidade. `transparent`, `currentColor` e preto em máscaras continuam valores funcionais legítimos.

## Layout, espaçamento e movimento

| Token | Valor ou função |
|---|---|
| `--container` | `77.5rem` |
| `--gutter` | `clamp(1.25rem, 4vw, 3rem)` |
| `--header-height` | `5rem`; `4.5rem` em telas pequenas |
| `--section-space` | `clamp(5rem, 10vw, 9rem)` |
| `--radius-sm` | `0.625rem` |
| `--radius-md` | `1.125rem` |
| `--radius-lg` | `1.125rem` |
| `--radius-pill` | `62.4375rem` |
| `--icon-size-sm` | `1rem` |
| `--shadow-soft` | Sombra ampla para superfícies elevadas |
| `--duration-fast` | `180ms` |
| `--duration-base` | `320ms` |
| `--ease-standard` | Curva padrão |
| `--ease-out` | Entrada e deslocamento |

O container compartilhado é:

```html
<div class="container">...</div>
```

Ele considera `--gutter` dos dois lados e limita o conteúdo a `--container`.

## Temas de seção

Páginas internas usam `.site-section` com um modificador de fundo:

- `.site-section--paper`
- `.site-section--white`
- `.site-section--dark`
- `.site-section--surface`
- `.site-section--yellow`

Use `.site-section--rounded-top` quando a seção precisa sobrepor visualmente a anterior com cantos superiores arredondados.

```html
<section class="site-section site-section--paper site-section--rounded-top"
         aria-labelledby="secao-title">
  <div class="container">...</div>
</section>
```

## Motivos visuais da marca

`internal.css` traduz três detalhes gráficos da homepage em primitivas reutilizáveis. Eles são decoração, não conteúdo, e por isso são desenhados em pseudo-elementos sem interação:

- `.motif-lines`: linhas amarelas do universo de Quem Somos; use em fundos escuros para comunicar conexão, cultura ou processo;
- `.motif-stripes`: faixas diagonais amarelas; use em superfícies claras associadas a expertises, serviços ou organização de um catálogo;
- `.motif-blob`: forma orgânica do CTA da homepage; use em faixas amarelas de conversão ou fechamento.

Modificadores disponíveis:

- `.motif-lines--aside`: concentra as linhas na lateral do hero;
- `.motif-lines--404`: recorte ampliado e mais sutil para a página de erro;
- `.motif-stripes--band`: limita as faixas à parte inferior da seção.

Exemplo:

```html
<section class="site-section site-section--dark motif-lines"
         aria-labelledby="principios-title">
  <div class="container">...</div>
</section>
```

Use no máximo um motivo novo por página e associe-o à função semântica acima. Preserve áreas extensas sem decoração, não coloque padrões atrás de texto longo ou campos de formulário e não adicione movimento a esses elementos. A Política de Privacidade permanece intencionalmente neutra. Opacidade, máscara, recorte responsivo, isolamento e ordem de camadas já são definidos pelo componente compartilhado.

## Header e navegação

O componente canônico está em [`quem-somos/index.html`](../quem-somos/index.html). Sua estrutura trabalha em conjunto com `site.css` e `site.js`.

- `.nav`: header fixo sobre fundo escuro.
- `.nav.nav--light`: estado inicial sobre fundo claro ou amarelo.
- `.nav.scrolled`: estado aplicado por JavaScript após o scroll.
- `.nav-links` e `.mobile-nav`: recebem `aria-current="page"` automaticamente.
- `.mobile-menu`: painel controlado por `.open`, `aria-hidden` e `inert`.
- `.brand-logo--dark`: versão escura do logo em fundos claros.

Não altere IDs ou atributos ARIA do menu em uma página isolada.

A troca entre `.nav--light` e `.scrolled` é deliberadamente imediata para fundo, texto, logo e botão do menu. Não anime essas propriedades entre os dois temas: durante a interpolação, o contraste pode cair abaixo de AA sobre seções brancas ou amarelas. Sombra e borda podem continuar animadas.

## Botões

```html
<a class="button" href="/contato/">Conversar ↗</a>
<a class="button button--secondary" href="/cases/">Ver cases</a>
<a class="button button--dark" href="/contato/">Enviar briefing</a>
```

- `.button`: fundo amarelo, texto escuro.
- `.button--secondary` ou `.button.secondary`: contorno usando a cor corrente.
- `.button--dark`: fundo escuro, indicado para superfícies amarelas ou claras.

Os estados de hover, foco e transição já são compartilhados. Não replique essas regras em CSS de página.

## Hero e cabeçalho de seção

O hero atual das páginas internas usa:

```html
<section class="page-hero page-hero--yellow" aria-labelledby="page-title">
  <div class="container page-hero__layout">
    <div>
      <p class="page-hero__kicker" data-reveal>Rótulo</p>
      <h1 class="page-hero__title" id="page-title" data-reveal data-delay="1">
        Título com <em>ênfase.</em>
      </h1>
    </div>
    <div class="page-hero__aside" data-reveal data-delay="2">
      <p class="page-hero__lead">Resumo da página.</p>
    </div>
  </div>
</section>
```

Remova `.page-hero--yellow` para a versão escura. Cabeçalhos de seções de conteúdo combinam `.section-heading`, `.section-kicker`, `.section-title` e `.section-lead`.

## Componentes internos disponíveis

`internal.css` oferece composições reutilizáveis:

- `.story-grid` e `.story-mark`: narrativa institucional;
- `.principles-grid` e `.principle-card`: princípios ou pilares;
- `.stats-grid` e `.stat-item`: indicadores, somente quando o conteúdo estiver aprovado;
- `.client-grid` e `.client-tile`: marcas;
- `.expertise-list` e `.expertise-panel`: unidades e serviços;
- `.tag-list` e `.tag`: etiquetas;
- `.integration-grid` e `.integration-orbit`: operação integrada;
- `.case-listing` e `.listing-card`: cases;
- `.article-listing` e `.article-card`: artigos;
- `.contact-cards` e `.contact-card`: canais de contato;
- `.content-stack`: pilha simples de conteúdo;
- `.cta-band` e `.cta-band__layout`: CTA de fechamento;
- `.legal-layout`, `.legal-toc` e `.legal-content`: conteúdo legal;
- `.not-found`: página 404;
- `.button-row`: grupo responsivo de ações.

Reutilize esses componentes antes de criar uma variação. Se a nova regra for útil a várias páginas internas, ela pertence a `internal.css`; se for exclusiva, crie um stylesheet específico em `assets/css/pages/`.

### Catálogo de Serviços

`services.css` complementa a base interna exclusivamente em `/servicos/`:

- `.service-jump` e `.service-jump__item`: atalhos para as quatro frentes;
- `.service-chapter`: capítulo temático de cada frente;
- `.service-groups` e `.service-group`: agrupamentos de entregas;
- `.service-groups--two`: variante para capítulos com dois grupos;
- `.service-cases__action`: espaçamento da ação após a grade compartilhada de cases.

Os blocos de competências e provas reais reutilizam, respectivamente, `.principles-grid` e `.case-listing` de `internal.css`. Essas classes não substituem `.expertise-panel`: Expertises apresenta as unidades de negócio; Serviços cataloga entregas concretas e mostra aplicações em projetos publicados.

## Reveal e redução de movimento

Elementos com `data-reveal` começam ocultos e recebem `.visible` por `site.js`.

```html
<article data-reveal>...</article>
<article data-reveal="left" data-delay="1">...</article>
<article data-reveal="scale" data-delay="2">...</article>
```

Valores implementados: padrão vertical, `left` e `scale`; atrasos disponíveis: `1`, `2` e `3`. O CSS e o JavaScript respeitam `prefers-reduced-motion`. Conteúdo essencial nunca deve depender da animação para ficar acessível.

## Formulários

`forms.css` define:

- `.form-layout` e `.form-intro`;
- `.preview-form`;
- `.form-field` e `.form-field--full`;
- `.field-hint` e `.field-error`;
- `.form-consent` e `.form-actions`;
- `.form-preview-note`;
- `.form-status`, `.form-status--success` e `.form-status--error`.

Cada campo obrigatório precisa de `label`, `required`, `aria-describedby` e um elemento `.field-error` com `aria-live="polite"`. O status geral usa `role="status"` e `data-form-status`.

## Imagens, logos e ícones

- Use `/assets/logo.svg` para a assinatura principal.
- Use `/assets/x-mark.svg` para o símbolo da marca e elementos decorativos.
- Os SVGs de decoração compartilhados ficam em `/assets/images/decor/`; não duplique o arquivo para variar apenas posição ou opacidade.
- Imagens de conteúdo precisam de `alt` significativo e `loading="lazy"`, exceto quando forem candidatas claras a LCP.
- Elementos puramente decorativos usam `alt=""` e `aria-hidden="true"`.
- Preserve proporção com `object-fit: cover` quando o componente definir uma área de mídia.

## Responsividade e acessibilidade

O sistema começa em desktop e reduz grids nos breakpoints definidos em cada stylesheet. Toda mudança deve ser conferida, no mínimo, em 1920 px e 390 px.

Requisitos compartilhados:

- foco visível;
- skip link funcional;
- headings em ordem lógica;
- um único `h1`;
- contraste adequado ao tema da seção;
- controles com nome acessível;
- navegação mobile operável por teclado e Escape;
- ausência de overflow horizontal;
- suporte a redução de movimento.

Não use estilos inline para contornar o sistema; ajuste a camada correta e preserve os tokens existentes.
