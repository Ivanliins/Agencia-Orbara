#!/usr/bin/env bash
# Posiciona as falas (audio/l1..l6.wav), abaixa a trilha sob a voz, normaliza e junta aos vídeos.
# Uso: ./mix.sh
set -euo pipefail
cd "$(dirname "$0")"
AT=(600 3700 8750 12700 17000 24300)  # início de cada fala em ms (ver T em commercial.html)

inputs=(); chains=""; labels=""
for i in 1 2 3 4 5 6; do
  inputs+=(-i "audio/l$i.wav")
  d=${AT[$((i-1))]}
  chains+="[$((i-1)):a]adelay=${d}|${d}[v$i];"
  labels+="[v$i]"
done
ffmpeg -y -v error "${inputs[@]}" -filter_complex \
  "${chains}${labels}amix=inputs=6:normalize=0,apad=whole_dur=30,atrim=0:30,highpass=f=80,acompressor=threshold=-18dB:ratio=3:attack=5:release=120,volume=1.6[v]" \
  -map "[v]" -ar 44100 -ac 2 out/narracao.wav

ffmpeg -y -v error -i out/trilha.wav -i out/narracao.wav -filter_complex \
  "[1:a]asplit=2[sc][vo];[0:a]volume=0.45[m];[m][sc]sidechaincompress=threshold=0.05:ratio=4:attack=15:release=350[duck];[duck][vo]amix=inputs=2:normalize=0,alimiter=limit=0.95,loudnorm=I=-14:TP=-1:LRA=11[a]" \
  -map "[a]" -ar 44100 out/mix.wav

for f in 16x9 9x16; do
  ffmpeg -y -v error -i "out/orbara-impacto-$f-sem-audio.mp4" -i out/mix.wav -map 0:v -map 1:a \
    -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "out/orbara-impacto-$f.mp4"
  echo "✓ out/orbara-impacto-$f.mp4"
done
