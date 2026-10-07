# Orbara Impacto — filme de marca (30s)

Um ponto explode em partículas, as partículas desenham o wireframe de um site, o site fica sólido,
ganha todas as telas, despenca para a página 5 do Google e sobe até o 1º lugar. Corte seco para o
silêncio, o celular vibra, as mensagens viram uma enxurrada e tudo implode de volta no ponto, que vira
o logo: "Orbara. Sites que fazem barulho."

- `commercial.html` — animação (GSAP + canvas); abra com `?f=h` ou `?f=v` para ver o preview
- `audio/l1..l6.wav` — narração (Fish Audio, voz "Narrador Propagandas"), sem silêncio nas pontas
- `render.cjs` — render quadro a quadro (Playwright + ffmpeg): `node render.cjs h out/orbara-impacto-16x9-sem-audio.mp4`
- `music.py` — trilha original sintetizada (numpy), presa aos cortes: `python3 music.py out/trilha.wav`
- `mix.sh` — posiciona as falas, abaixa a trilha sob a voz, normaliza (-14 LUFS) e junta aos vídeos
- `out/orbara-impacto-16x9.mp4` e `out/orbara-impacto-9x16.mp4` — versões finais

Narração:
> Tudo começa com um ponto. · Um ponto vira ideia. A ideia vira um site que ninguém esquece. ·
> Rápido em qualquer tela. Pronto para o Google. · Do fundo da busca... direto para o topo! ·
> E aí? O seu telefone não para mais de tocar. · Orbara. Sites que fazem barulho.
