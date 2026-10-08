import { PortraitPhoto } from "@/components/stages/portrait-photo";

/**
 * الصورة الشخصية بإطار pixel. بدون صورة (profileImage: null) بيطلع راس الشخصية الـ pixel،
 * وما بينبعت أي JS (PortraitPhoto ما بينرسم).
 */
export function Portrait({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return (
      <figure className="portrait no-photo">
        <div className="portrait-frame">
          <span className="portrait-fallback" aria-hidden="true" />
        </div>
      </figure>
    );
  }

  return <PortraitPhoto src={src} alt={alt} />;
}
