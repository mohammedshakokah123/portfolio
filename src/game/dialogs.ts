import { play } from "./sound";

export function initDialogs() {
  const controller = new AbortController();

  document.addEventListener(
    "click",
    (e) => {
      if (!(e.target instanceof Element)) return;

      const opener = e.target.closest<HTMLElement>("[data-dialog]");
      if (opener) {
        const dialog = document.getElementById(opener.dataset.dialog ?? "");
        if (dialog instanceof HTMLDialogElement && !dialog.open) {
          play("select");
          dialog.showModal();
          // المودال بيفتح من أوله حتى لو تسكّر قبل وهو بنص الـ scroll
          dialog.querySelector(".modal-body")?.scrollTo(0, 0);
        }
        return;
      }

      // الضغط عالـ backdrop: الـ target هو الـ <dialog> نفسه (المحتوى جوّا .win اللي مغطّي كل مساحته)
      const dialog = e.target.closest("dialog");
      if (dialog && (e.target === dialog || e.target.closest("[data-close]"))) dialog.close();
    },
    { signal: controller.signal },
  );

  return () => controller.abort();
}
