# Guia de Manutenção e Expansão — Expertise

Este guia orienta alterações e criação de páginas sem quebrar o sistema compartilhado. Leia também [`ESTRUTURA.md`](ESTRUTURA.md) e [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) antes de editar.

## Princípios do projeto

1. O site é HTML, CSS e JavaScript nativos, servido diretamente como arquivos estáticos.
2. Não há build obrigatório no desenvolvimento; a publicação apenas empacota os arquivos estáticos para o subcaminho do GitHub Pages.
3. Reutilize tokens, componentes, header, menu e footer existentes.
4. Separe estilos e comportamentos compartilhados dos específicos de uma página.
5. Não publique fatos herdados sem validação.
6. Preserve acessibilidade, SEO, responsividade e redução de movimento.
7. Não faça hotlink de mídia do site anterior.

## Antes de alterar

- Confirme a rota e o arquivo em [`ESTRUTURA.md`](ESTRUTURA.md).
- Leia o HTML inteiro da página afetada.
- Confira quais folhas de estilo e scripts ela carrega.
- Ao alterar conteúdo herdado ou URLs, use somente fontes aprovadas pelo responsável do projeto e registre os redirecionamentos na configuração da hospedagem.
- Verifique o estado do Git e preserve alterações não relacionadas.

## Referência canônica

Para páginas internas, use [`quem-somos/index.html`](../quem-somos/index.html) como referência do:

- `<head>` e sua ordem de recursos;
- skip link;
- header e navegação desktop;
- menu mobile;
- footer;
- atributos de acessibilidade e dados estruturados.

Copie o shell atual e substitua apenas o conteúdo específico da página e os metadados necessários. Não use uma página antiga ou a homepage como base do header/footer.

## Checklist para uma nova página

### 1. Criar a rota

Para a rota `/nova-pagina/`, crie:

```text
nova-pagina/index.html
```

Use caminhos de assets absolutos a partir da raiz, como `/assets/css/tokens.css`.

### 2. Ajustar o head

- [ ] `lang="pt-BR"`, charset e viewport presentes.
- [ ] `<title>` exclusivo e descritivo.
- [ ] Meta description exclusiva.
- [ ] Canonical absoluto com a rota final.
- [ ] Open Graph com título, descrição, URL e imagem coerentes.
- [ ] Favicon e preload da fonte preservados.
- [ ] JSON-LD mantido ou adaptado somente quando os dados forem verdadeiros.
- [ ] CSS carregado na ordem `tokens.css`, `site.css`, stylesheet da página.
- [ ] Scripts carregados com `defer`.

### 3. Preservar o shell compartilhado

- [ ] Header, menu mobile e footer copiados de `quem-somos/index.html`.
- [ ] Skip link aponta para `#conteudo`.
- [ ] `<body data-page="nova-pagina">`.
- [ ] `<main id="conteudo">`.
- [ ] IDs `nav`, `menu-btn`, `mobile-menu` e `menu-close` intactos.
- [ ] Navegações mantêm `data-site-nav`.

### 4. Montar o conteúdo

- [ ] Um único `h1`, associado ao hero por `aria-labelledby`.
- [ ] Seções com heading identificável.
- [ ] Componentes de `internal.css` reutilizados antes de criar CSS novo.
- [ ] Quando houver motivo visual, usar no máximo uma família entre `.motif-lines`, `.motif-stripes` e `.motif-blob`, conforme o papel documentado no Design System.
- [ ] CTA final aponta para uma rota existente.
- [ ] IDs de âncora são únicos, estáveis e preservam âncoras já publicadas.
- [ ] Links externos usam `rel="noopener noreferrer"` quando abrem nova aba.
- [ ] Imagens têm dimensões/composição adequadas, `alt` correto e carregamento apropriado.

### 5. Escolher CSS e JavaScript

| Tipo de página | CSS | JavaScript |
|---|---|---|
| Homepage | `tokens.css`, `site.css`, `pages/home.css` | `site.js`, `home.js` |
| Interna comum | `tokens.css`, `site.css`, `pages/internal.css` | `site.js` |
| Detalhe de case | anteriores + `pages/case-detail.css` | `site.js` |
| Página que abre cases em camada | stylesheet da página + `pages/case-overlay.css` | `site.js`, `case-catalog.js`, `case-overlay.js` |
| Catálogo de Serviços | anteriores + `pages/services.css` | `site.js` |
| Interna com formulário | anteriores + `pages/forms.css` | `site.js`, `forms.js` |
| 404 | `tokens.css`, `site.css`, `pages/internal.css` | `site.js` |

Não carregue `home.js` nem `forms.js` em páginas que não usam seus contratos. Não copie JavaScript para dentro do HTML.

### 6. Atualizar a arquitetura pública

- [ ] Adicionar a rota a [`sitemap.xml`](../sitemap.xml) quando ela for pública e indexável.
- [ ] Atualizar navegação e footer em todas as páginas somente se a rota entrar nesses componentes.
- [ ] Planejar e configurar no provedor de hospedagem os redirecionamentos necessários antes de remover ou renomear uma URL.
- [ ] Confirmar que links locais e fragmentos possuem destino.

### 7. Validar

- [ ] Abrir a rota diretamente em `http://127.0.0.1:5500/`.
- [ ] Testar desktop em 1920 px e mobile em 390 px.
- [ ] Confirmar ausência de overflow horizontal.
- [ ] Verificar console e falhas de rede.
- [ ] Navegar por teclado, testar foco, Escape e menu mobile.
- [ ] Verificar `aria-current="page"`.
- [ ] Testar fragmentos após o header fixo.
- [ ] Conferir o comportamento com redução de movimento.
- [ ] Validar HTML e links locais.
- [ ] Revisar título, description, canonical, Open Graph e hierarquia de headings.

### Exceções de unidade e cor

- Prefira `rem`, `em`, `%`, `vw` e `clamp()` para apresentação. Hairlines e grids decorativos também usam `0.0625rem`.
- Preserve `px` quando ele fizer parte de um contrato técnico: recorte `.sr-only`, `IntersectionObserver`, coordenadas ou deslocamentos calculados pelo DOM e dimensões intrínsecas de imagens no HTML.
- Cores opacas devem vir de `--color-*`. Para transparência contextual, use `rgb(var(--rgb-*) / alpha)`.
- `theme-color` no HTML permanece hexadecimal porque custom properties CSS não funcionam em atributos `content`.

## Onde colocar uma mudança

- Novo token global ou fonte: [`tokens.css`](../assets/css/tokens.css).
- Reset, botão, navegação, footer ou utilitário compartilhado: [`site.css`](../assets/css/site.css).
- Elemento exclusivo da homepage: [`pages/home.css`](../assets/css/pages/home.css) ou [`home.js`](../assets/js/home.js).
- Componente reutilizado por páginas internas: [`pages/internal.css`](../assets/css/pages/internal.css).
- Estrutura exclusiva dos detalhes de case: [`pages/case-detail.css`](../assets/css/pages/case-detail.css).
- Catálogo e capítulos exclusivos de Serviços: [`pages/services.css`](../assets/css/pages/services.css).
- Apresentação de formulário: [`pages/forms.css`](../assets/css/pages/forms.css).
- Comportamento global: [`site.js`](../assets/js/site.js).
- Validação de formulário preview: [`forms.js`](../assets/js/forms.js).

Evite promover uma regra para a camada global sem uso compartilhado real. Evite também duplicar uma regra global apenas para mudar uma página.

Os motivos gráficos da homepage que já foram transformados em componentes pertencem a `internal.css`. Ajuste recorte e intensidade por modificador ou custom property local; não copie a implementação específica de `home.css` para uma página interna.

## Contratos do JavaScript

### `site.js`

Espera a estrutura canônica do menu, links em `[data-site-nav]`, elementos opcionais em `[data-reveal]`, players em `[data-video-id]` e ano em `[data-current-year]`. Todos os seletores opcionais são tolerantes à ausência, mas IDs do menu devem permanecer consistentes.

### `home.js`

Atualiza a barra `#progress` e exibe `.home-intro` por cerca de 1,1 segundo, uma vez por sessão, ao entrar no topo da home sem fragmento de URL. Os indicadores `[data-count]` animam uma vez ao entrar na tela, usam `[data-suffix]` e preservam o texto final declarado no HTML.

O título `[data-hero-words]` alterna as palavras separadas por `|`, começando por EXPERIÊNCIAS. As letras entram de baixo para cima com um pequeno atraso entre elas, seguido de 3,6 segundos de leitura. `.hero-word-space` reserva o espaço da palavra original; `.hero-word-layer` contém as letras animadas. O `aria-label` do `h1` mantém a mensagem acessível estável. A troca pausa quando o título ou a aba deixam de estar visíveis.

O botão `[data-motion-toggle]` pausa ou retoma o movimento por meio de `.motion-paused`; a pausa encerra a abertura, conclui os contadores e deixa uma palavra inteira no título. `prefers-reduced-motion` desativa abertura, troca de palavras e contagem animada, e tem prioridade sobre esse botão. O título volta a EXPERIÊNCIAS com movimento reduzido. A classe `.home-motion-ready` habilita as entradas de `[data-reveal]` quando há suporte a `IntersectionObserver` e movimento permitido; o conteúdo permanece visível sem JavaScript.

### `forms.js`

Atua apenas em `form[data-preview-form]`. Cada campo deve apontar via `aria-describedby` para sua mensagem `.field-error`; o status geral deve usar `[data-form-status]`.

### `case-catalog.js` e `case-overlay.js`

Os cards com `data-case-overlay` devem apontar para `/cases/?case=slug`. O catálogo usa o mesmo slug presente em `window.EXPERTISE_CASES`; assim, o link continua utilizável sem JavaScript e pode ser compartilhado. A camada usa `<dialog>`, atualiza o histórico sem recarregar a página, fecha com Escape ou pelo botão, restaura o foco e troca os cases seguintes sem empilhar etapas no botão Voltar.

Cada mídia publicada fica em `assets/images/cases/material/slug/`, em WebP, sem metadados e com no máximo 2400 px no maior lado. Use fotografias em sangria quando a resolução permitir. Artes verticais entram inteiras sobre fundo tonal com o X, sem máscaras que dividam a imagem.

## Formulários: estado de preview

Contato e Faça Parte não enviam nem armazenam dados. O submit atual:

1. impede a submissão nativa;
2. valida campos no navegador;
3. marca `aria-invalid`;
4. move o foco para o primeiro erro ou para a mensagem de sucesso;
5. informa explicitamente que nada foi enviado.

Até a integração ser aprovada:

- mantenha `data-preview-form`, `novalidate` e o aviso visível;
- não adicione `action` que aponte para serviço provisório;
- não simule envio real;
- não registre conteúdo do formulário no console ou storage.

Antes da produção, devem ser definidos backend, destinatários, proteção contra abuso, segurança de upload, limite e varredura de arquivos, retenção, exclusão, observabilidade, estados de erro e aderência à política de privacidade.

## Uso de conteúdo herdado

Materiais brutos do site anterior não são versionados neste repositório público. Trate qualquer conteúdo fornecido separadamente como uma pista editorial, nunca como autorização automática de publicação.

Conteúdo explicitamente aprovado pelo responsável do projeto pode ser reutilizado enquanto permanecer atual. Exige validação do cliente quando envolver:

- métricas e resultados;
- prêmios, associações ou certificações;
- nomes, cargos e fotos de pessoas;
- produtos e plataformas;
- endereço, telefone e destinatários;
- direitos de uso de imagens ou marcas;
- política de privacidade, cookies e base legal.

Não faça o novo site depender de URLs, scripts, fontes ou imagens do WordPress anterior.

## Preview e verificação

O endereço de trabalho é:

```text
http://127.0.0.1:5500/
```

Inicie um servidor estático na raiz do repositório. O Live Server pode atender essa porta; outra opção é:

```bash
python3 -m http.server 5500 --bind 127.0.0.1
```

Faça a inspeção sempre pela URL HTTP. Caminhos absolutos `/assets/...` não funcionam corretamente quando o HTML é aberto diretamente pelo sistema de arquivos.

## Critérios de conclusão

Uma página só está pronta quando:

- conteúdo e fatos foram revisados;
- aparência está coerente com o sistema atual;
- shell canônico foi preservado;
- desktop e mobile foram verificados;
- HTML, links, assets e fragmentos estão válidos;
- não há erros de console;
- navegação por teclado funciona;
- SEO básico está completo;
- sitemap e redirecionamentos configurados na hospedagem estão coerentes;
- nenhuma integração de preview foi apresentada como funcional.
