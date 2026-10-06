# Images — orbara.com.br

**Score: 55/100**

## O que funciona
- Todas as `<img>` da home e dos cases têm `alt` descritivo (ex.: "Preview do site Empório Júnior do Queijo")
- `loading="lazy"` nas imagens abaixo da dobra
- Vídeos de motion comprimidos (720p, ~1,6–2,7 MB) com poster

## Findings
- 🔴 **`hero-bg.jpg` com 1,9 MB** (ver performance.md).
- 🟠 **Imagens dos cases são de banco (Unsplash), hot-linked de `images.unsplash.com`** com legendas de "evidência" — problema de confiança (content.md) e dependência de domínio externo.
- 🟡 **Nenhuma `<img>` tem `width`/`height`**: hoje o CLS está baixo porque os containers têm altura fixa, mas qualquer mudança de layout pode gerar shift.
- 🟡 **Sem formatos modernos** (WebP/AVIF) em nenhuma imagem.
- 🔵 Logo do schema em SVG (precisa de PNG/JPG para o Google).
