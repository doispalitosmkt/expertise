# Design QA — revisão editorial dos cases Expertise

## Escopo e referências

- A identidade visual vem de `material/SITE-20260915T162548Z-1-001/SITE/Proposta Visual Expertise.pdf` e `material/SITE-20260915T162548Z-1-001/SITE/Proposta - New Assets Expertise.pdf`.
- Os textos e as imagens dos projetos vêm do material fornecido em `material/SITE-20260915T162548Z-1-001/SITE/`.
- A referência de navegação é a página [Shopper Marketing da Outpromo](https://www.outpromo.com.br/shoppermarketing), registrada em `tmp/design-qa/reference-outpromo-current-loaded.png`: área editorial contida à esquerda e projetos apresentados por imagens à direita.
- Este passe avalia o redesign dos cases em sobreposição à home. As capturas anteriores da home e do catálogo continuam em `tmp/design-qa/`, mas as antigas imagens `case-overlay-*-final.png` representam o template substituído e não são evidência do resultado atual.

## Problema observado e correção

O template anterior abria com um painel amarelo de título muito grande e deixava a fotografia principal em outra faixa; o texto de apresentação, os números e o próximo case também usavam escala excessiva. Galerias de três imagens podiam terminar com uma foto isolada em meia coluna, e cases com vídeo repetiam a mesma imagem como capa e cartaz. Isso aparece em `tmp/design-qa/critique-current-adium.png`, `critique-current-adium-below.png`, `critique-current-adium-middle.png` e `critique-current-single-start.png`.

O novo layout usa uma abertura editorial dividida: título, contexto, cliente e local em um painel amarelo estreito; fotografia ou peça do projeto ocupando o campo visual principal. A narrativa entra em papel claro, com corpo de texto controlado e resultados em grade compacta. As galerias têm enquadramento e largura definidos por case, evitando imagens soltas. O filme é acionado sobre a própria imagem de abertura, sem segundo cartaz. O próximo projeto combina miniatura e chamada curta. O X aparece como assinatura de baixa intensidade em superfícies de marca, sem cortar fotografias.

Os 29 registros de `assets/js/case-catalog.js` têm metadados `presentation`. Eles selecionam imagens de abertura e galeria, `cover` ou `contain`, proporção e posição, incluindo apresentações em par e panorâmicas. A composição usa apenas os arquivos que sustentam a narrativa visual; fotos redundantes não são forçadas à página.

## Evidências visuais do redesign

| Amostra | Captura | Verificação |
| --- | --- | --- |
| Convenção Adium, abertura | `tmp/design-qa/redesign-adium-start-01.png` | Título e lead têm escala legível; fotografia do evento domina a abertura sem faixa intermediária vazia. |
| Convenção Adium, galeria e saída | `tmp/design-qa/redesign-adium-end-02.png` | Duas fotos formam um par equilibrado; o próximo case tem imagem e chamada proporcionais. |
| Portal Leve Mais Nestlé, desktop e mobile | `tmp/design-qa/redesign-pair-start-01.png`, `redesign-pair-mobile-02.png` | Peças verticais são mostradas em par com `contain`, preservando a arte e a leitura no mobile. |
| Adrenalina Chapada dos Guimarães | `tmp/design-qa/redesign-panorama-start-02.png` | A foto de grupo mantém enquadramento panorâmico; contexto e lead ocupam um cabeçalho horizontal mais compacto. |
| Lollapalooza | `tmp/design-qa/redesign-single-start-01.png` | Um case com uma única imagem não recebe uma galeria vazia; vídeo permanece integrado à capa. |
| Missão Possível | `tmp/design-qa/redesign-metrics-start-01.png`, `redesign-metrics-end-01.png` | Arte contida sem corte; seis números em grade 3 × 2, seguidos de um próximo case visual. |
| Vivo Rio Pro / WSL | `tmp/design-qa/redesign-wsl-start-01.png`, `redesign-wsl-end-01.png` | Abertura com enquadramento próprio e galeria de peças verticais coerente. |
| Vídeo ativo | `tmp/design-qa/redesign-video-active-01.png` | O player substitui a capa dentro do mesmo campo visual. |

As amostras cobrem casos com uma imagem, pares verticais, galerias, fotografia panorâmica, métricas e vídeo. O material mostra uma direção visual mais próxima da referência, mantendo o amarelo e o X próprios da Expertise. Não houve identificação de divergência visual P0, P1 ou P2 nessas amostras.

## Interação e verificação técnica

- O case continua em `<dialog>` modal, com botão de fechar persistente, foco inicial, retorno do foco ao fechar e suporte a `Escape`.
- URLs compartilháveis usam `/cases/?case=slug`; o histórico controla abertura, navegação entre projetos e fechamento.
- O vídeo só cria o iframe de `youtube-nocookie.com` depois da ação do usuário.
- O catálogo permanece agrupado em Eventos, Trade Marketing, Viagens e Logística e Campanhas de Incentivo.
- `node --check assets/js/case-overlay.js`, `node --check assets/js/case-catalog.js` e `git diff --check` passaram neste passe. `rg` confirmou 29 slugs e 29 blocos `presentation` no catálogo. O `git diff --check` exibiu apenas avisos de conversão LF/CRLF do ambiente Windows.
- O build para `/expertise/` reescreve os caminhos absolutos das folhas de estilo; a verificação do artefato confirmou as referências dos assets no subdiretório de publicação.

## Resultado final

passed
