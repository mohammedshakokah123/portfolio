"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * false بالسيرفر وبالـ hydration، true بعدها. بديل `useEffect(() => setMounted(true))`
 * بدون setState جوّا effect (وبدون render زيادة قبل الـ commit).
 */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
