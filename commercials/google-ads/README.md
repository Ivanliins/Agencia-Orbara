# Comercial Google Ads — Orbara (30s)

Motion graphics feito em HTML + GSAP e renderizado quadro a quadro, com narração (Fish Audio, voz "Narrador Propagandas") e trilha original.

- `commercial.html` — animação (abra no navegador com `?f=h` ou `?f=v` para ver o preview)
- `audio/l1..l6.wav` — falas da narração, já sem silêncio nas pontas
- `timing.py` — mede as falas e gera `timing.json` (onde cada cena começa para a fala caber; total 30s)
- `render.cjs` — renderiza para MP4 (Playwright + ffmpeg), seguindo `timing.json`: `node render.cjs h out/orbara-google-ads-16x9-sem-audio.mp4`
- `music.py` — trilha sintetizada (numpy), alinhada aos cortes de `timing.json`: `python3 music.py out/trilha.wav`
- `mix.sh` — posiciona as falas, abaixa a trilha sob a voz, normaliza (-14 LUFS) e junta aos vídeos
- `out/orbara-google-ads-16x9.mp4` e `out/orbara-google-ads-9x16.mp4` — versões finais

Ordem: `python3 timing.py && node render.cjs h ... && node render.cjs v ... && python3 music.py out/trilha.wav && ./mix.sh`

Narração:
> Agora mesmo, tem alguém no Google procurando exatamente o que você vende. A pergunta é: ele vai encontrar você... ou o seu concorrente? Com o Google Ads da Orbara, sua empresa aparece na hora certa, para a pessoa certa. Campanhas cirúrgicas, página feita para converter e otimização todos os dias. Menos clique desperdiçado. Mais cliente chamando no WhatsApp. Orbara. Fale com a gente.
