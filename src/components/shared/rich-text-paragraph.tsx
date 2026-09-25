import type { RichText } from "@/types/content";

/** الـ string بينعرض متل ما هو، و`{ emphasis }` بينلف بـ text-emphasis */
export function RichTextParagraph({ text }: { text: RichText }) {
  return (
    <p>
      {text.map((seg, i) =>
        typeof seg === "string" ? (
          seg
        ) : (
          <span key={i} className="text-emphasis">
            {seg.emphasis}
          </span>
        ),
      )}
    </p>
  );
}
