"use client";

import { useEffect } from "react";

import { takeSectionFocusRequest } from "@/lib/sections";

/**
 * لما نوصل للرئيسية من صفحة تانية بـ SectionLink (متل "/#projects" من صفحة مشروع)، الـ SectionLink
 * بيرجع لـ next/link عادي، وهاد بيعمل scroll للقسم بس والـ focus بيضل عالرابط بالـ Header.
 * هون، بعد ما الرئيسية تنعرض، منعمل focus عالقسم (بدون scroll، لأن Next عمله).
 * منعتمد عالطلب اللي سجّله الـ SectionLink مش عالـ hash، مشان الـ Back/Forward يخلّوا الـ focus مكانه.
 */
export function HashFocus() {
  useEffect(() => {
    const id = takeSectionFocusRequest();
    // إذا الـ navigation ما كمّل لهون (URL تاني)، ما منعمل شي
    if (!id || window.location.hash !== `#${id}`) return;
    document.getElementById(id)?.focus({ preventScroll: true });
  }, []);

  return null;
}
