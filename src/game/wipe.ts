import { STAGE_NAMES, STAGES, type StageId } from "./stages";

type Cell = [x: number, y: number, order: number];

let el: HTMLElement | null = null;
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let cells: Cell[] = [];

/**
 * canvas صغير (خلية لكل 30px من الشاشة، و22px عالموبايل) والـ CSS بيكبّره بـ image-rendering: pixelated.
 * الترتيب قطري من فوق-يسار لتحت-يمين مع شوية عشوائية، فالتغطية بتطلع "ذوبان بكسلات".
 */
function setup() {
  if (!canvas) return;
  const size = window.innerWidth < 720 ? 22 : 30;
  const cols = Math.ceil(window.innerWidth / size);
  const rows = Math.ceil(window.innerHeight / size);
  canvas.width = cols;
  canvas.height = rows;
  ctx = canvas.getContext("2d");
  if (ctx) ctx.fillStyle = "#14142B";
  cells = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      cells.push([x, y, (x / cols + y / rows) / 2 + Math.random() * 0.22]);
    }
  }
  cells.sort((a, b) => a[2] - b[2]);
}

function run(ms: number, fill: boolean) {
  return new Promise<void>((resolve) => {
    const n = cells.length;
    const t0 = performance.now();
    let done = 0;
    const step = (t: number) => {
      const target = Math.min(n, Math.ceil(((t - t0) / ms) * n));
      for (; done < target; done++) {
        const [x, y] = cells[done];
        if (fill) ctx?.fillRect(x, y, 1, 1);
        else ctx?.clearRect(x, y, 1, 1);
      }
      if (done < n) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}

export const wipe = {
  async cover(ms: number) {
    setup();
    el?.classList.add("is-on");
    await run(ms, true);
  },
  /** بنفس ترتيب التغطية: أول بكسل تغطّى أول واحد بينكشف */
  async reveal(ms: number) {
    await run(ms, false);
    el?.classList.remove("is-on");
  },
};

/** بطاقة "Stage 2 / Skills" فوق الـ wipe وهو مغطّي */
export const card = {
  show(id: StageId) {
    const i = STAGES.indexOf(id);
    const no = el?.querySelector("[data-card-no]");
    const name = el?.querySelector("[data-card-name]");
    if (no) no.textContent = i === 0 ? "Back to" : `Stage ${i}`;
    if (name) name.textContent = i === 0 ? "Title screen" : STAGE_NAMES[id];
    el?.classList.add("is-card");
  },
  hide() {
    el?.classList.remove("is-card");
  },
};

export function initWipe() {
  el = document.querySelector<HTMLElement>(".wipe");
  canvas = el?.querySelector("canvas") ?? null;

  return () => {
    el?.classList.remove("is-on", "is-card");
    el = null;
    canvas = null;
    ctx = null;
    cells = [];
  };
}
