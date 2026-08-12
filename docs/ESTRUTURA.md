# Estrutura do Projeto — Expertise

Este repositório é um site institucional estático e multipágina, feito com HTML, CSS e JavaScript nativos. Não há etapa de build, bundler, framework, gerenciador de pacotes ou geração de páginas: cada rota pública corresponde a um arquivo HTML versionado.

## Árvore principal

```text
.
├── index.html
├── 404.html
├── quem-somos/index.html
├── nossas-expertises/index.html
├── servicos/index.html
├── cases/index.html
├── blog/index.html
├── faca-parte/index.html
├── contato/index.html
├── politica-de-privacidade/index.html
├── assets/
│   ├── css/
│   │   ├── tokens.css
│   │   ├── site.css
│   │   └── pages/
│   │       ├── home.css
│   │       ├── internal.css
│   │       ├── services.css
│   │       └── forms.css
│   ├── js/
│   │   ├── site.js
│   │   ├── home.js
│   │   └── forms.js
│   ├── fonts/
│   ├── icons/
│   ├── images/
│   ├── logo.svg
│   └── x-mark.svg
├── docs/
│   ├── content-source/
│   ├── CODEX-GUIDE.md
│   ├── DESIGN-SYSTEM.md
│   ├── ESTRUTURA.md
│   └── redirect-map.csv
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
| `/cases/` | [`cases/index.html`](../cases/index.html) | Vitrine de cases |
| `/blog/` | [`blog/index.html`](../blog/index.html) | Arquivo editorial |
| `/faca-parte/` | [`faca-parte/index.html`](../faca-parte/index.html) | Candidatura em modo de pré-visualização |
| `/contato/` | [`contato/index.html`](../contato/index.html) | Contato em modo de pré-visualização |
| `/politica-de-privacidade/` | [`politica-de-privacidade/index.html`](../politica-de-privacidade/index.html) | Política de privacidade |
| Erro 404 | [`404.html`](../404.html) | Página não encontrada |

As rotas canônicas publicadas também devem permanecer sincronizadas em [`sitemap.xml`](../sitemap.xml). O arquivo [`robots.txt`](../robots.txt) aponta para esse sitemap. Rotas legadas e destinos de migração estão inventariados em [`redirect-map.csv`](redirect-map.csv); esse CSV é planejamento e não implementa redirecionamentos por conta própria.

## Camadas de CSS

A ordem de carregamento é parte do contrato:

1. [`assets/css/tokens.css`](../assets/css/tokens.css): fontes locais e custom properties globais.
2. [`assets/css/site.css`](../assets/css/site.css): reset, base, container, botões, header, menu mobile, reveal e footer.
3. Um stylesheet de página em [`assets/css/pages/`](../assets/css/pages/):
   - [`home.css`](../assets/css/pages/home.css) para a homepage;
   - [`internal.css`](../assets/css/pages/internal.css) para páginas internas e 404;
   - [`services.css`](../assets/css/pages/services.css), depois de `internal.css`, somente para o catálogo de Serviços;
   - [`forms.css`](../assets/css/pages/forms.css), depois de `internal.css`, somente nas páginas com formulário.

Regras compartilhadas pertencem a `site.css`; regras exclusivas de uma família de páginas pertencem ao arquivo correspondente em `pages/`. Não duplicar os estilos globais dentro do HTML.

## Camadas de JavaScript

- [`assets/js/site.js`](../assets/js/site.js): comportamento compartilhado — estado do header, menu mobile com controle de foco, item de navegação atual, reveal por `IntersectionObserver`, player sob demanda com YouTube sem cookies e ano corrente.
- [`assets/js/home.js`](../assets/js/home.js): comportamento exclusivo da homepage — barra de progresso e parallax dos cases, respeitando redução de movimento e viewport.
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

- `assets/fonts/`: Plus Jakarta Sans, Editor e VT323 em formatos locais, com a licença da VT323.
- `assets/icons/`: iconografia SVG.
- `assets/images/`: imagens da homepage, cases, blog, clientes e decoração.
- `assets/logo.svg`: assinatura principal.
- `assets/x-mark.svg`: símbolo da marca e favicon.

Imagens novas devem ser otimizadas, ter nome estável e ficar em uma subpasta coerente. Não fazer hotlink do site legado.

## Conteúdo arquivado

O inventário editorial versionado está em [`docs/content-source/`](content-source/README.md):

- [`pages.md`](content-source/pages.md): páginas institucionais, expertises e soluções;
- [`cases.md`](content-source/cases.md): inventário dos cases;
- [`blog.md`](content-source/blog.md): inventário dos artigos;
- [`contact-and-legal.md`](content-source/contact-and-legal.md): contatos, formulários e conteúdo legal;
- [`site-map.md`](content-source/site-map.md): arquitetura pública do site anterior.

O snapshot mecânico bruto está em `.legacy-site-archive/`, ignorado pelo Git. Ele guarda HTML/XML para consulta histórica, não é dependência de produção e não contém as mídias originais baixadas.

Antes de publicar informações herdadas, valide com o cliente números, certificações, equipe, serviços ativos, plataformas, contatos, direitos de imagem e textos legais. O arquivo legado serve como fonte de pesquisa, não como autorização automática de publicação.

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
