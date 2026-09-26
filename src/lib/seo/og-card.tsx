/**
 * تصميم صور الـ OG (1200×630) المشترك بين الرئيسية وصفحات المشاريع. بيترسم بـ ImageResponse (satori)،
 * فالـ styles inline بس، وأي div فيه أكتر من ولد لازم يكون display: flex.
 * الألوان من ثيم الـ dark (globals.css): background وbrand وmuted-foreground وsubtle.
 */
export function OgCard({
  eyebrow,
  title,
  subtitle,
  meta,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  meta: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#09090b",
        color: "#fff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 14,
            background: "#4f46e5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          MS
        </div>
        <div style={{ fontSize: 28, color: "#818cf8" }}>{eyebrow}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1 }}>
          {title}
        </div>
        <div style={{ fontSize: 30, color: "#a1a1aa", marginTop: 24 }}>{subtitle}</div>
      </div>
      <div style={{ fontSize: 24, color: "#84848d" }}>{meta}</div>
    </div>
  );
}
