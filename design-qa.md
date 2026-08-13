# Design QA — cases, contato e galeria do case Terra

## Comparação

- Source visual truth paths:
  - `/tmp/codex-clipboard-51f76b1c-2047-4240-b63c-5e341db63a35.png` — seção removida da página de cases, 1600 × 659 px.
  - `/tmp/codex-clipboard-a3ebaa4e-645e-45e5-9813-ed3f712399fd.png` — estado anterior dos cards de contato, 1454 × 395 px.
  - `/tmp/codex-clipboard-0a86c43f-06dc-4e7c-874e-710bcbbce2df.png` — linguagem visual do destaque do case usada como referência para a nova seção, 1600 × 831 px.
- Implementation screenshot paths:
  - `/tmp/expertise-qa/cases-1600x659.png` — listagem após a remoção da seção.
  - `/tmp/expertise-qa/contact-1454x900-final.png` e `/tmp/expertise-qa/contact-1454x394-final.png` — seção e recorte dos cards corrigidos.
  - `/tmp/expertise-qa/gallery-1600x828.png` e `/tmp/expertise-qa/gallery-second-row-1600x828.png` — cabeçalho, primeira e segunda linhas da galeria.
  - `/tmp/expertise-qa/contact-390x844.png`, `/tmp/expertise-qa/cases-390x844.png` e `/tmp/expertise-qa/gallery-390x844-final.png` — evidência responsiva.
- Side-by-side comparison paths:
  - `/tmp/expertise-qa/compare-cases.jpg`
  - `/tmp/expertise-qa/compare-contact-final.jpg`
  - `/tmp/expertise-qa/compare-gallery.jpg`
- CSS viewports: 1600 × 659 para Cases; 1455 × 901 para Contato; 1600 × 828 para a galeria; 1024 × 901, 770 × 901 e 390 × 845 para responsividade.
- Density normalization: `devicePixelRatio: 1`. O navegador interno exclui a barra de rolagem do arquivo capturado, por isso os JPEGs desktop medem 15 px a menos na largura; os comparativos foram normalizados por escala proporcional.
- State: fontes carregadas, animações de entrada concluídas, âncoras posicionadas sob o header fixo e as duas linhas da galeria visitadas.

## Full-view comparison evidence

A seção clara “Portfólio selecionado” não aparece mais na listagem. O hero agora segue diretamente para a área escura de projetos, que recebeu o modificador de cantos arredondados e preserva a transição visual existente.

Nos cards de contato, o estado anterior quebrava e-mail e telefone à força e distribuía o endereço por muitas linhas. O estado final mantém e-mail e telefone em uma linha no desktop, reduz o endereço a três linhas legíveis e não apresenta estouro. Em tablet, os cards passam para duas colunas e o endereço ocupa a largura total; em mobile, passam para uma coluna.

O case ganhou uma seção escura independente entre o destaque amarelo e o vídeo. A galeria usa quatro registros reais do vídeo oficial do projeto, em grade 2 × 2 no desktop e em uma coluna no celular, mantendo o vocabulário de tipografia, amarelo, bordas, raios e espaçamento do site.

## Focused region comparison evidence

Os três comparativos side-by-side foram abertos e inspecionados juntos. O comparativo de Cases confirma que o bloco solicitado foi removido sem espaço morto; o de Contato confirma a redução de escala e a eliminação das quebras problemáticas; o da galeria confirma continuidade visual com o destaque editorial do print 3. A segunda linha da galeria foi capturada separadamente porque fica abaixo da dobra no viewport de referência.

## Required fidelity surfaces

- Fonts and typography: Plus Jakarta Sans permanece como fonte principal e a família Editor foi restaurada no token `--font-editorial`, com arquivos próprios para 400/700 normal e itálico. Na galeria, o navegador confirmou `Editor, Georgia, serif`, itálico 400, em “imagens.”, sem fallback ou erro de carregamento. Os conteúdos dos cards usam `clamp(0.9375rem, 1.25vw, 1.125rem)`, com peso e entrelinha preservados. Não há truncamento nem overflow.
- Spacing and layout rhythm: o arredondamento foi transferido para a seção seguinte em Cases; o grid de Contato responde em 3 → 2 → 1 colunas; a galeria responde em 2 → 1. Não há sobreposição ou overflow horizontal nos viewports testados.
- Colors and visual tokens: a implementação reutiliza `--color-ink`, `--color-surface`, `--color-yellow`, `--line-light` e os raios existentes, sem introduzir uma paleta paralela.
- Image quality and asset fidelity: os quatro WebP têm 640 × 360 px e são quadros do vídeo do próprio case. No maior estado testado são renderizados a aproximadamente 602 × 338 px, sem ampliação acima da resolução nativa. Todos carregam, mantêm 16:9 e têm texto alternativo específico.
- Copy and content: o conteúdo removido não deixou referência órfã. Títulos, legendas e descrições da galeria correspondem a fatos já presentes na página e no vídeo do case.
- Accessibility and behavior: há um único `h1` por página; a nova seção usa `aria-labelledby`, `figure`, `figcaption` e `alt`. Menu mobile abre, atualiza ARIA e fecha com Escape. O link da listagem navega para o case e o botão do vídeo substitui o poster pelo iframe sob demanda.

## Findings

- Nenhum P0, P1 ou P2 acionável permanece.
- Nenhuma imagem quebrada, referência local ausente, quebra horizontal, erro ou aviso de console foi encontrado.
- A imagem de referência da galeria representa a seção anterior, não um mock exato da nova grade; a validação de fidelidade foi feita contra a linguagem visual e o posicionamento solicitados, não por paridade pixel a pixel de conteúdo.

## Open Questions

- Nenhuma para esta entrega.

## Comparison history

- Pass 1: identificou a seção redundante em Cases, quebras forçadas e tipografia superdimensionada em Contato, e ausência de galeria no case.
- Pass 2: removeu o bloco, preservou a curva da transição, criou o grid responsivo e adicionou quatro registros reais. A tipografia de Contato foi inicialmente reduzida a 16 px no desktop e ficou visualmente conservadora.
- Pass 3: a tipografia desktop foi refinada para 18 px máximos, mantendo e-mail e telefone em uma linha e o endereço sem overflow. Desktop, tablet e mobile não apresentaram P0/P1/P2 após a correção.
- Pass 4: a fonte editorial provisória foi corrigida de Bodoni Moda para Editor, usando os quatro estilos fornecidos no pacote do cliente. O build, o carregamento do arquivo e a família computada foram validados novamente.

## Implementation Checklist

- [x] Seção do print 1 removida sem lacuna estrutural.
- [x] E-mail e telefone sem quebras forçadas.
- [x] Tipografia dos três cards ajustada e responsiva.
- [x] Galeria nova com quatro imagens reais e legendas.
- [x] Grid validado em desktop, tablet e mobile.
- [x] Menu, navegação para o case e player sob demanda testados.
- [x] Imagens, HTML/CSS, referências locais e artefato do GitHub Pages validados.
- [x] Console sem erros ou avisos.

## Follow-up Polish

- Nenhum P3 necessário para esta entrega.

final result: passed
