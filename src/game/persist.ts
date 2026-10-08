/** نفس مفاتيح الملف المرجعي وصيغها */
export const KEYS = { time: "ms-time", sound: "ms-sound", gems: "ms-gems" } as const;

/** للقيم المخزّنة JSON (ms-sound وms-gems). أي خطأ (storage مسكّر، JSON خربان) ← fallback */
export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked */
  }
}

/** ms-time نص خام ("day" / "night") مش JSON، متل المرجع */
export function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeRaw(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage blocked */
  }
}
