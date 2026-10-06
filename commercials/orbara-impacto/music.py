"""Trilha original do filme "Orbara Impacto" (30s), sintetizada com numpy e presa aos cortes do vídeo.

Marcos (segundos), iguais ao objeto T de commercial.html:
  0.3 / 1.1 / 1.9 batimentos  | 2.3-2.95 sucção  | 2.95 explosão
  5.45 site sólido (batida leve) | 8.45 glitch + batida cheia | 12.2 queda
  14.14-15.04 subida | 15.04 impacto | 16.3-16.8 silêncio total
  16.8 celular vibrando | 17.9-21.8 enxurrada de notificações | 22.35-23.2 implosão
  23.4 / 23.75 batimentos | 24.1 logo | 25.4-26.35 palavras | 26.35 "barulho" | 30 fim
Uso: python3 music.py out/trilha.wav
"""
import sys
import wave
import numpy as np

SR = 44100
DUR = 30.0
BPM = 120
BEAT = 60 / BPM
N = int(SR * DUR)
rng = np.random.default_rng(3)
mix = np.zeros((N, 2))


def t_arr(d):
    return np.arange(int(SR * d)) / SR


def place(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N or i < 0:
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


def noise(d):
    return rng.standard_normal(int(SR * d))


def kick(gain_pitch=1.0):
    t = t_arr(0.45)
    f = 48 + 130 * gain_pitch * np.exp(-t * 32)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)


def heartbeat():
    t = t_arr(0.35)
    f = 40 + 50 * np.exp(-t * 25)
    return lowpass(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11), 300) * 2.2


def hat(open_=False):
    t = t_arr(0.18 if open_ else 0.05)
    n = rng.standard_normal(len(t))
    return (n - lowpass(n, 6000)) * np.exp(-t * (18 if open_ else 70))


def clap():
    t = t_arr(0.25)
    n = rng.standard_normal(len(t))
    return (n - lowpass(n, 1200)) * np.exp(-t * 22)


def saw(freq, d):
    t = t_arr(d)
    return 2 * ((t * freq) % 1) - 1


def bass(freq, d):
    s = lowpass(saw(freq, d) + 0.6 * np.sin(2 * np.pi * freq / 2 * t_arr(d)), 380)
    return s * env(len(s), 0.004, min(0.1, d * 0.4))


def pluck(freq, d=0.35):
    t = t_arr(d)
    s = (saw(freq, d) * 0.5 + np.sin(2 * np.pi * freq * t)) * np.exp(-t * 9)
    return lowpass(s, 2500)


def pad(freqs, d, a=0.6, r=0.8):
    t = t_arr(d)
    s = sum(np.sin(2 * np.pi * f * t + 0.3 * np.sin(2 * np.pi * 0.4 * t)) + 0.4 * np.sin(2 * np.pi * f * 2.003 * t) for f in freqs)
    return s / len(freqs) * env(len(t), a, r)


def riser(d, f0=200, f1=2200):
    t = t_arr(d)
    n = rng.standard_normal(len(t))
    hp = n - lowpass(n, 800)
    sweep = np.sin(2 * np.pi * np.cumsum(f0 + (f1 - f0) * (t / d) ** 2) / SR)
    return (hp * 0.6 + sweep * 0.3) * (t / d) ** 2


def suck(d):
    """Pratos ao contrário: cresce e corta seco."""
    t = t_arr(d)
    n = rng.standard_normal(len(t))
    return (n - lowpass(n, 2500)) * (t / d) ** 3


def boom(d=2.5, sub=36):
    t = t_arr(d)
    b = np.sin(2 * np.pi * np.cumsum(sub + 70 * np.exp(-t * 5)) / SR) * np.exp(-t * 1.6)
    n = rng.standard_normal(len(t))
    crash = (n - lowpass(n, 3000)) * np.exp(-t * 2.4) * 0.55
    return b * 1.3 + crash


def drop_sweep(d=0.6):
    t = t_arr(d)
    f = 900 * np.exp(-t * 5) + 50
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.01, 0.2) * 0.8


def whoosh_up(d):
    t = t_arr(d)
    n = rng.standard_normal(len(t))
    band = lowpass(n, 4000) - lowpass(n, 500)
    sweep = np.sin(2 * np.pi * np.cumsum(150 + 2500 * (t / d) ** 3) / SR) * 0.4
    return (band + sweep) * np.sin(np.pi * np.clip(t / d, 0, 1) * 0.5) ** 2 * 1.4


def glitch(d=0.3):
    n = int(SR * d)
    out = np.zeros(n)
    i = 0
    while i < n:
        seg = int(SR * rng.uniform(0.01, 0.04))
        f = rng.choice([220, 440, 880, 1760, 3520])
        tt = np.arange(seg) / SR
        out[i : i + seg] = np.sign(np.sin(2 * np.pi * f * tt))[: n - i] * rng.uniform(0.3, 0.8) if rng.random() < 0.6 else rng.standard_normal(min(seg, n - i)) * 0.6
        i += seg
    return np.round(out * 6) / 6


def ding(f):
    t = t_arr(0.5)
    return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.01 * t)) * np.exp(-t * 9)


def buzz(d):
    t = t_arr(d)
    on = (np.sin(2 * np.pi * 2.5 * t) > -0.2).astype(float)
    return lowpass(saw(150, d), 600) * on * 0.8


def beat(start, end, full=True, gain=1.0):
    k = 0
    for b in np.arange(start, end - 0.01, BEAT):
        place(kick(), b, 0.95 * gain)
        if full and k % 2 == 1:
            place(clap(), b, 0.4 * gain)
        place(hat(), b + BEAT / 2, 0.2 * gain, 0.25)
        if full:
            place(hat(), b + BEAT / 4, 0.08 * gain, -0.25)
            place(hat(), b + 3 * BEAT / 4, 0.08 * gain, -0.25)
        k += 1


ROOTS = [55.0, 43.65, 65.41, 49.0]  # A – F – C – G
CHORDS = [[220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [196.0, 261.6, 329.6], [196.0, 246.9, 293.7]]
ARP = [440.0, 523.3, 659.3, 880.0, 659.3, 523.3]


def bassline(start, end, gain=0.5):
    for i, b in enumerate(np.arange(start, end - 0.01, BEAT / 2)):
        root = ROOTS[int((b - start) // (4 * BEAT)) % 4]
        place(bass(root * (2 if i % 4 == 3 else 1), BEAT / 2 * 0.85), b, gain)


# ── Abertura: silêncio, batimentos, sucção, explosão ──
place(pad([55.0, 82.4], 3.0, 1.5, 0.3), 0.0, 0.12)
for at in (0.3, 1.1, 1.9):
    place(heartbeat(), at, 0.9)
    place(heartbeat(), at + 0.22, 0.55)
place(suck(0.65), 2.3, 0.7)
place(boom(3.0, 32), 2.95, 1.0)

# ── Partículas formando o site: arpejo acelerando + pad ──
place(pad(CHORDS[0], 2.8, 0.4, 0.6), 2.95, 0.16)
t, step = 3.2, 0.25
k = 0
while t < 5.4:
    place(pluck(ARP[k % len(ARP)]), t, 0.28, 0.4 if k % 2 else -0.4)
    k += 1
    t += step
    step = max(0.09, step * 0.9)
place(riser(1.2, 300, 3000), 4.25, 0.45)

# ── Site sólido: impacto + batida leve ──
place(boom(1.6, 45), 5.45, 0.6)
beat(5.45, 8.45, full=False, gain=0.8)
bassline(5.45, 8.45, 0.35)
for i, b in enumerate(np.arange(5.45, 8.4, BEAT / 2)):
    place(pluck(ARP[i % len(ARP)] * 0.5), b, 0.13, 0.3 if i % 2 else -0.3)
place(riser(0.9), 7.55, 0.45)

# ── Glitch + batida cheia em todas as telas ──
place(glitch(0.32), 8.33, 0.5)
place(boom(1.8, 40), 8.45, 0.75)
beat(8.45, 12.2)
bassline(8.45, 12.2, 0.5)
for k in range(2):
    place(pad(CHORDS[(k + 2) % 4], 8 * BEAT * 0.5, 0.3, 0.5), 8.45 + k * 4 * BEAT, 0.1)
place(ding(1760), 10.7, 0.25)  # nota 100

# ── Queda para o fundo da busca, tensão, subida, impacto ──
place(drop_sweep(0.7), 12.2, 0.8)
for b in np.arange(12.6, 14.1, BEAT / 4):
    place(hat(), b, 0.1 + 0.15 * (b - 12.6) / 1.5)
place(pad([55.0, 58.3], 2.0, 0.3, 0.2), 12.35, 0.2)  # dissonância
place(whoosh_up(0.95), 14.12, 0.75)
place(boom(2.2, 38), 15.04, 1.0)
place(ding(1318.5), 15.06, 0.3, 0.3)
place(ding(1975.5), 15.12, 0.25, -0.3)
beat(15.04, 16.3)
bassline(15.04, 16.3, 0.5)
# 16.3–16.8: silêncio total (corte seco no vídeo)

# ── Celular: vibração, mensagens, enxurrada crescente ──
place(buzz(1.0), 16.95, 0.35)
for i, at in enumerate((17.15, 17.43, 17.71)):
    place(ding(1318.5 * (1.12 ** i)), at, 0.3, (-0.3, 0.3, 0)[i])
beat(17.9, 22.35, gain=0.95)
bassline(17.9, 22.35, 0.5)
NF = 72
pitches = [1046.5, 1174.7, 1318.5, 1568.0, 1760.0, 2093.0]
for k in range(NF):
    at = 17.9 + 3.9 * np.sqrt(k / NF)
    place(ding(pitches[(k * 5) % len(pitches)]), at, 0.07 + 0.08 * k / NF, ((k * 37) % 11 - 5) / 6)
place(riser(2.0, 200, 3500), 20.35, 0.55)

# ── Implosão, silêncio, batimentos, logo ──
place(glitch(0.22), 22.25, 0.4)
place(suck(0.85), 22.35, 0.9)
place(drop_sweep(0.4), 23.2, 0.4)
place(heartbeat(), 23.4, 1.0)
place(heartbeat(), 23.75, 0.8)
place(suck(0.4), 23.7, 0.4)
place(boom(3.5, 30), 24.1, 1.1)
place(pad([220.0, 277.2, 329.6, 440.0], 5.9, 0.2, 1.2), 24.1, 0.22)  # A maior
for i, at in enumerate((25.4, 25.72, 25.98)):
    place(kick(1.4), at, 0.6)
    place(clap(), at, 0.2)
place(boom(2.0, 36), 26.35, 0.9)
for b in np.arange(26.9, 29.0, BEAT):
    place(kick(), b, 0.55)
    place(hat(), b + BEAT / 2, 0.12)
bassline(26.9, 29.0, 0.3)
place(boom(1.5, 45), 29.0, 0.45)

# Master
mix = np.tanh(mix * 1.15)
fade = int(0.9 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.89
# silêncio de verdade entre 16.3 e 16.8 (com 8 ms de rampa para não estalar)
a, b, r = int(16.3 * SR), int(16.8 * SR), int(0.008 * SR)
mix[a - r : a] *= np.linspace(1, 0, r)[:, None]
mix[a:b] = 0

out = sys.argv[1] if len(sys.argv) > 1 else "out/trilha.wav"
with wave.open(out, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print("✓", out)
