"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";

/**
 * sonner (~23KB gzip) ما بيتحمّل مع الصفحة: الـ toast الوحيد بعد ما ينبعت الفورم، فمنجيبه أول مرة بينطلب.
 * الـ Toaster لازم يكون mounted قبل `toast()`، وإلا الـ toast بيضيع (بيوصل بس للـ subscribers الموجودين).
 * مشان هيك `ensureToaster` بتستنى لحد ما الـ Toaster ينعرض (الـ effects تبعه بتخلص قبل effects الأب).
 */
let ensureToaster: (() => Promise<void>) | null = null;

export function LazyToaster() {
  const [Toaster, setToaster] = useState<ComponentType | null>(null);
  const pending = useRef<(() => void)[]>([]);
  const loaded = useRef(false);

  useEffect(() => {
    ensureToaster = () =>
      new Promise<void>((resolve) => {
        if (loaded.current) return resolve();
        pending.current.push(resolve);
        void import("@/components/ui/sonner").then((m) => setToaster(() => m.Toaster));
      });
    return () => {
      ensureToaster = null;
    };
  }, []);

  useEffect(() => {
    if (!Toaster) return;
    loaded.current = true;
    pending.current.splice(0).forEach((resolve) => resolve());
  }, [Toaster]);

  return Toaster ? <Toaster /> : null;
}

export async function toastSuccess(message: React.ReactNode) {
  await ensureToaster?.();
  const { toast } = await import("sonner");
  toast.success(message);
}
