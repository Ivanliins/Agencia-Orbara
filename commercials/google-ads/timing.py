"""Calcula o novo tempo das cenas a partir da duração das falas (narração) e grava timing.json.

Cada cena dura o suficiente para a fala caber (fala acelerada em TEMPO), e o total fecha em 30s.
render.cjs usa o mapa para converter o tempo do vídeo no tempo original da timeline,
music.py para realinhar a trilha e mix.sh para posicionar as falas.
Uso: python3 timing.py
"""
import json
import wave

TEMPO = 1.1
TOTAL = 30.0
ORIG = [0.0, 4.2, 8.6, 13.6, 19.6, 25.0, 30.0]  # inícios das cenas em commercial.html
LEAD = [0.1, 0.1, 0.15, 0.1, 0.1, 0.55]  # quanto depois do corte a fala começa


def dur(path):
    with wave.open(path) as w:
        return w.getnframes() / w.getframerate() / TEMPO


speech = [dur(f"audio/l{i}.wav") for i in range(1, 7)]
lengths = [max(d + LEAD[i] + 0.25, (ORIG[i + 1] - ORIG[i]) * 0.9) for i, d in enumerate(speech[:5])]
lengths.append(TOTAL - sum(lengths))
starts = [0.0]
for L in lengths:
    starts.append(round(starts[-1] + L, 3))

timing = {
    "tempo": TEMPO,
    "orig": ORIG,
    "new": starts,
    "voice": [round(starts[i] + LEAD[i], 3) for i in range(6)],
}
json.dump(timing, open("timing.json", "w"), indent=2)
for i in range(6):
    print(f"S{i+1}: {starts[i]:6.2f} – {starts[i+1]:6.2f}  fala {speech[i]:.2f}s em {timing['voice'][i]:.2f}")
