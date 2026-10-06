"""Trilha original do comercial (30s, 120 BPM), sintetizada com numpy e alinhada aos cortes do vídeo.

Marcos (segundos), iguais aos da timeline em commercial.html:
  0.0  abertura (pad + tique-taque) | 0.7-2.0 digitação
  4.2  tensão (baixo pulsando)      | 7.6-8.6 subida
  8.6  impacto + batida completa    | 21.3 risco (swoosh)
  23.0 / 23.6 notificações          | 24.0-25.0 subida
  25.0 impacto final + assinatura   | 30.0 fim
Se existir timing.json (timing.py), os marcos são convertidos com W() para o tempo das cenas
reajustadas à narração.
Uso: python3 music.py out/trilha.wav
"""
import json
import os
import sys
import wave
import numpy as np

_tf = os.path.join(os.path.dirname(os.path.abspath(__file__)), "timing.json")
_timing = json.load(open(_tf)) if os.path.exists(_tf) else None


def W(t):
    """Tempo original da timeline -> tempo no vídeo final."""
    if not _timing:
        return t
    o, n = _timing["orig"], _timing["new"]
    for i in range(len(o) - 1):
        if t < o[i + 1] or i == len(o) - 2:
            return n[i] + (t - o[i]) * (n[i + 1] - n[i]) / (o[i + 1] - o[i])
    return t


SR = 44100
DUR = 30.0
BPM = 120
BEAT = 60 / BPM
N = int(SR * DUR)
rng = np.random.default_rng(7)
mix = np.zeros((N, 2))


def t_arr(d):
    return np.arange(int(SR * d)) / SR


def place(sig, at, gain=1.0, pan=0.0):
    """Soma um sinal mono na mixagem estéreo a partir de `at` segundos."""
    i = int(at * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    mix[i : i + len(sig), 0] += sig * (1 - max(pan, 0))
    mix[i : i + len(sig), 1] += sig * (1 + min(pan, 0))


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for n in range(len(x)):
        acc = (1 - a) * x[n] + a * acc
        y[n] = acc
    return y


def env(n, a=0.005, r=0.2):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na:
        e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def kick():
    t = t_arr(0.45)
    f = 50 + 120 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)


def hat(open_=False):
    t = t_arr(0.18 if open_ else 0.05)
    n = rng.standard_normal(len(t))
    n = n - lowpass(n, 6000)
    return n * np.exp(-t * (18 if open_ else 70))


def clap():
    t = t_arr(0.25)
    n = rng.standard_normal(len(t))
    n = n - lowpass(n, 1200)
    return n * np.exp(-t * 22)


def click():
    t = t_arr(0.03)
    n = rng.standard_normal(len(t))
    return (n - lowpass(n, 3000)) * np.exp(-t * 200)


def saw(freq, d):
    t = t_arr(d)
    return 2 * ((t * freq) % 1) - 1


def bass_note(freq, d):
    s = lowpass(saw(freq, d) + 0.5 * np.sin(2 * np.pi * freq / 2 * t_arr(d)), 420)
    return s * env(len(s), 0.004, min(0.12, d * 0.4))


def pad(freqs, d):
    t = t_arr(d)
    s = sum(np.sin(2 * np.pi * f * t + 0.3 * np.sin(2 * np.pi * 0.4 * t)) + 0.4 * np.sin(2 * np.pi * f * 2.003 * t) for f in freqs)
    return s / len(freqs) * env(len(t), 0.6, 0.8)


def riser(d):
    t = t_arr(d)
    n = rng.standard_normal(len(t))
    hp = n - lowpass(n, 800)
    sweep = np.sin(2 * np.pi * np.cumsum(200 + 1800 * (t / d) ** 2) / SR)
    return (hp * 0.6 + sweep * 0.25) * (t / d) ** 2


def impact():
    t = t_arr(2.2)
    boom = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-t * 6)) / SR) * np.exp(-t * 2.2)
    n = rng.standard_normal(len(t))
    crash = (n - lowpass(n, 3500)) * np.exp(-t * 2.8) * 0.5
    return boom + crash


def swoosh(d=0.5):
    t = t_arr(d)
    n = rng.standard_normal(len(t))
    band = lowpass(n, 2500) - lowpass(n, 400)
    return band * np.sin(np.pi * t / d) ** 2 * 2


def ding(f=1318.5):
    t = t_arr(0.6)
    return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 1.5 * t)) * np.exp(-t * 7)


# Progressão Am – F – C – G (frequências)
CHORDS = [[220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [196.0, 261.6, 329.6], [196.0, 246.9, 293.7]]
ROOTS = [55.0, 43.65, 65.41, 49.0]
BAR = 4 * BEAT

# Pad em todo o comercial (2 compassos por acorde)
for k, start in enumerate(np.arange(0, DUR, BAR)):
    ch = CHORDS[k % 4]
    place(pad(ch, BAR + 0.6), start, 0.16 if start < W(8.6) else 0.12)

# Abertura: tique-taque + cliques de digitação
for b in np.arange(0, W(4.2), BEAT / 2):
    place(hat(), b, 0.12, 0.3)
for i in range(20):  # "serviço perto de mim"
    place(click(), W(0.7) + i * ((W(2.0) - W(0.7)) / 20), 0.35, -0.2)

# Tensão: baixo pulsando em colcheias
for b in np.arange(W(4.2), W(8.6), BEAT / 2):
    place(bass_note(55.0, BEAT / 2 * 0.9), b, 0.35)
place(riser(1.0), W(8.6) - 1.0, 0.5)

# Drop: batida completa 8.6 – 24.5
place(impact(), W(8.6), 0.9)
beat_end = W(24.5)
k = 0
for b in np.arange(W(8.6), beat_end, BEAT):
    place(kick(), b, 0.9)
    if k % 2 == 1:
        place(clap(), b, 0.35)
    place(hat(), b + BEAT / 2, 0.18, 0.25)
    place(hat(), b + BEAT / 4, 0.07, -0.25)
    place(hat(), b + 3 * BEAT / 4, 0.07, -0.25)
    k += 1
for i, b in enumerate(np.arange(W(8.6), beat_end, BEAT / 2)):
    root = ROOTS[int((b - W(8.6)) // (2 * BAR)) % 4]
    place(bass_note(root * (2 if i % 4 == 3 else 1), BEAT / 2 * 0.85), b, 0.45)

# Efeitos sincronizados
place(swoosh(0.5), W(13.6) - 0.2, 0.35)
place(swoosh(0.5), W(19.6) - 0.2, 0.35)
place(swoosh(0.45), W(21.25), 0.5)
place(ding(1318.5), W(23.0), 0.35, 0.3)
place(ding(1568.0), W(23.6), 0.35, -0.3)
place(riser(1.0), W(25.0) - 1.0, 0.5)

# Assinatura: impacto + batida em meio tempo
place(impact(), W(25.0), 0.95)
for b in np.arange(W(25.0), DUR - 1.0, BEAT * 2):
    place(kick(), b, 0.7)
place(pad([220.0, 261.6, 329.6, 440.0], DUR - W(25.0)), W(25.0), 0.2)
place(impact(), DUR - 1.0, 0.5)

# Master: limitação suave, fade final e normalização
mix = np.tanh(mix * 1.1)
fade = int(0.8 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.89

out = sys.argv[1] if len(sys.argv) > 1 else "out/trilha.wav"
with wave.open(out, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print("✓", out)
