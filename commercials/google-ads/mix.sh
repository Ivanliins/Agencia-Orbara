#!/usr/bin/env bash
# Monta a narração (falas em audio/l1..l6.wav nos tempos de timing.json), abaixa a trilha
# sob a voz (sidechain) e junta ao vídeo.
# Uso: ./mix.sh            -> out/narracao.wav, out/mix.wav e os dois MP4 finais
set -euo pipefail
cd "$(dirname "$0")"
TEMPO=$(python3 -c 'import json;print(json.load(open("timing.json"))["tempo"])')
mapfile -t AT < <(python3 -c 'import json;[print(int(v*1000)) for v in json.load(open("timing.json"))["voice"]]')

inputs=(); chains=""; labels=""
for i in 1 2 3 4 5 6; do
  inputs+=(-i "audio/l$i.wav")
  d=${AT[$((i-1))]}
  chains+="[$((i-1)):a]atempo=$TEMPO,adelay=${d}|${d}[v$i];"
  labels+="[v$i]"
done
ffmpeg -y -v error "${inputs[@]}" -filter_complex \
  "${chains}${labels}amix=inputs=6:normalize=0,apad=whole_dur=30,atrim=0:30,highpass=f=80,acompressor=threshold=-18dB:ratio=3:attack=5:release=120,volume=1.6[v]" \
  -map "[v]" -ar 44100 -ac 2 out/narracao.wav

ffmpeg -y -v error -i out/trilha.wav -i out/narracao.wav -filter_complex \
  "[1:a]asplit=2[sc][vo];[0:a]volume=0.42[m];[m][sc]sidechaincompress=threshold=0.015:ratio=10:attack=15:release=400[duck];[duck][vo]amix=inputs=2:normalize=0,alimiter=limit=0.95,loudnorm=I=-14:TP=-1:LRA=9[a]" \
  -map "[a]" -ar 44100 out/mix.wav

for f in 16x9 9x16; do
  ffmpeg -y -v error -i "out/orbara-google-ads-$f-sem-audio.mp4" -i out/mix.wav -map 0:v -map 1:a \
    -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "out/orbara-google-ads-$f.mp4"
  echo "✓ out/orbara-google-ads-$f.mp4"
done
