import { KEYS, readJson, writeJson } from "./persist";
import { createStore } from "./store";

export type SoundName =
  "select" | "jump" | "gem" | "bump" | "warp" | "start" | "success" | "error" | "toggle";

/** مطفي افتراضياً. المتصفح أصلاً ما بيسمح بصوت قبل أول تفاعل */
export const soundStore = createStore<boolean>(
  typeof window !== "undefined" && readJson<unknown>(KEYS.sound, false) === true,
);

type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

let ctx: AudioContext | null = null;

function unlock() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
}

type ToneOptions = { type?: OscillatorType; vol?: number; slide?: number; delay?: number };

/** نغمة وحدة 8-bit: oscillator مع fade سريع. slide = انزلاق التردد (للقفزة والـ warp) */
function tone(
  freq: number,
  dur: number,
  { type = "square", vol = 0.045, slide = 0, delay = 0 }: ToneOptions = {},
) {
  if (!soundStore.get() || !ctx) return;
  const t = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export function play(name: SoundName) {
  if (!soundStore.get()) return;
  unlock();
  switch (name) {
    case "select":
      tone(880, 0.05);
      tone(1320, 0.07, { delay: 0.05 });
      break;
    case "jump":
      tone(280, 0.22, { slide: 560 });
      break;
    case "gem":
      tone(1046, 0.08);
      tone(1568, 0.16, { delay: 0.07 });
      break;
    case "bump":
      tone(150, 0.08, { type: "triangle", vol: 0.12 });
      tone(988, 0.07, { delay: 0.06 });
      tone(1319, 0.12, { delay: 0.12 });
      break;
    case "warp":
      tone(780, 0.3, { type: "triangle", slide: -620, vol: 0.07 });
      break;
    case "start":
      [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.1, { delay: i * 0.08 }));
      break;
    case "success":
      [784, 988, 1175, 1568].forEach((f, i) => tone(f, 0.12, { delay: i * 0.09 }));
      break;
    case "error":
      tone(170, 0.18, { type: "sawtooth", vol: 0.035 });
      break;
    case "toggle":
      tone(520, 0.05);
      tone(780, 0.06, { delay: 0.04 });
      break;
  }
}

export function toggleSound() {
  const on = !soundStore.get();
  soundStore.set(on);
  writeJson(KEYS.sound, on);
  if (on) {
    unlock();
    play("toggle");
  }
}
