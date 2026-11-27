// 知識星圖的音效：全部用 Web Audio 即時合成，不放音檔；預設關，按 ♪ 才開。
// 音階用都節音階（箏常用的 1、♭2、4、5、♭6），音色是玻璃鐘：基音加兩個不和諧的泛音，再加一點回聲。
// 音高照星離北極多遠：靠北極的高、靠外圈的低。
const IN = [0, 1, 5, 7, 8];

export type Sfx = ReturnType<typeof makeSfx>;

export function makeSfx() {
  let ac: AudioContext | null = null;
  let dry: GainNode, wet: GainNode, noise: AudioBuffer;
  const ready = () => {
    if (!ac) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ac = new AC();
      const comp = ac.createDynamicsCompressor();
      comp.connect(ac.destination);
      dry = ac.createGain();
      dry.gain.value = 0.7;
      dry.connect(comp);
      // 回聲：延遲 0.29 秒、越來越暗
      wet = ac.createGain();
      wet.gain.value = 0.3;
      const dl = ac.createDelay(1), fb = ac.createGain(), lp = ac.createBiquadFilter();
      dl.delayTime.value = 0.29;
      fb.gain.value = 0.35;
      lp.type = "lowpass";
      lp.frequency.value = 1800;
      wet.connect(dl);
      dl.connect(lp);
      lp.connect(fb);
      fb.connect(dl);
      lp.connect(dry);
      noise = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ac.state === "suspended") void ac.resume();
    return ac;
  };
  const out = (g: AudioNode) => {
    g.connect(dry);
    g.connect(wet);
  };
  // 第 n 個音階音（0＝G3）
  const note = (n: number) => 196 * 2 ** (Math.floor(n / 5) + IN[((n % 5) + 5) % 5] / 12);
  const pitch = (rho: number) => Math.round((1 - Math.min(1, Math.max(0, rho))) * 8) + 4;
  const bell = (n: number, at = 0, vol = 0.1, dur = 1.8) => {
    const a = ready();
    if (!a) return;
    const t = a.currentTime + at, f = note(n);
    for (const [m, v] of [
      [1, 1],
      [2.76, 0.22],
      [5.4, 0.06],
    ]) {
      const o = a.createOscillator(), g = a.createGain();
      o.frequency.value = f * m;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol * v, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur / Math.sqrt(m));
      o.connect(g);
      out(g);
      o.start(t);
      o.stop(t + dur + 0.05);
    }
  };
  // 風聲：白噪音經過一個頻率滑動的帶通濾波器
  const whoosh = (dur: number, f0: number, f1: number, vol: number) => {
    const a = ready();
    if (!a) return;
    const t = a.currentTime;
    const src = a.createBufferSource(), bp = a.createBiquadFilter(), g = a.createGain();
    src.buffer = noise;
    src.loop = true;
    bp.type = "bandpass";
    bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(f0, t);
    bp.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.55);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp);
    bp.connect(g);
    out(g);
    src.start(t);
    src.stop(t + dur + 0.05);
  };
  return {
    ready,
    // 點一顆星
    star: (rho: number) => bell(pitch(rho), 0, 0.11),
    // 星座的線一條一條畫出來：每條線一個輕的音
    arp: (rhos: number[], t0: number, step: number) => rhos.forEach((r, k) => bell(pitch(r) + 2, t0 + k * step, 0.035, 1.2)),
    // 完成星座
    chord: (rho: number, at = 0) => [0, 2, 4, 7].forEach((d, k) => bell(pitch(rho) + d - 2, at + k * 0.06, 0.07, 2.6)),
    comet: (dur: number) => whoosh(dur, 350, 2600, 0.05),
    meteor: () => whoosh(0.7, 2500, 5200, 0.018),
    caught: () => {
      bell(13, 0, 0.08);
      bell(15, 0.09, 0.08);
    },
    // 尋星：點錯是一聲低的悶響，找到是往上的琶音
    miss: () => {
      const a = ready();
      if (!a) return;
      const t = a.currentTime, o = a.createOscillator(), g = a.createGain();
      o.frequency.setValueAtTime(150, t);
      o.frequency.exponentialRampToValueAtTime(70, t + 0.25);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      o.connect(g);
      g.connect(dry);
      o.start(t);
      o.stop(t + 0.35);
    },
    found: () => [8, 10, 12, 15].forEach((n, k) => bell(n, k * 0.07, 0.08, 2)),
    // 長曝光：低音慢慢打開，轉完一圈收在一個和弦
    expose: (dur: number) => {
      const a = ready();
      if (!a) return;
      const t = a.currentTime, lp = a.createBiquadFilter(), g = a.createGain();
      lp.type = "lowpass";
      lp.Q.value = 5;
      lp.frequency.setValueAtTime(220, t);
      lp.frequency.exponentialRampToValueAtTime(2200, t + dur * 0.8);
      lp.frequency.exponentialRampToValueAtTime(380, t + dur + 2);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.045, t + dur * 0.4);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 2.5);
      for (const [n, det] of [
        [2, -7],
        [2, 7],
        [5, 0],
      ]) {
        const o = a.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = note(n);
        o.detune.value = det;
        o.connect(lp);
        o.start(t);
        o.stop(t + dur + 2.6);
      }
      lp.connect(g);
      out(g);
      [7, 9, 11].forEach((n, k) => bell(n, dur - 0.2 + k * 0.08, 0.06, 2.6));
    },
  };
}
