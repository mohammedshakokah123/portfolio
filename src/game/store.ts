import { useSyncExternalStore } from "react";

export type Store<T> = {
  get(): T;
  set(next: T): void;
  subscribe(listener: () => void): () => void;
};

/** store صغير: قيمة وحدة ومشتركين. المحرك بيغيّره بـ set()، والمكوّنات بتقرأه بـ useStore() */
export function createStore<T>(initial: T): Store<T> {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set(next) {
      if (Object.is(next, value)) return;
      value = next;
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/**
 * serverValue: القيمة بالـ HTML اللي من السيرفر (السيرفر ما بيعرف الـ hash ولا الـ localStorage).
 * React بيستعملها وقت الـ hydration، وبعدها مباشرة بيعيد الرسم بالقيمة الحقيقية. بدون hydration mismatch.
 * ⚠️ إذا القيمة object أو مصفوفة، لازم serverValue يكون ثابت معرّف برّا المكوّن (نفس الـ reference كل مرة).
 */
export function useStore<T>(store: Store<T>, serverValue: T): T {
  return useSyncExternalStore(store.subscribe, store.get, () => serverValue);
}
