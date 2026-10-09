import { HEAD, HERO_PAL } from "@/pixel/sprites/hero";
import type { Palette, PixelMap } from "@/pixel/svg";

/**
 * sprite مرسوم بمستطيلات (نفس خوارزمية svg(): مستطيل لكل مجموعة بكسلات متتالية بنفس اللون).
 * satori (محرك ImageResponse) ما بيرسم CSS variables ولا background-image من الـ stylesheet.
 */
function Sprite({ map, pal, scale }: { map: PixelMap; pal: Palette; scale: number }) {
  const rects: React.ReactNode[] = [];
  map.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (c === ".") {
        x++;
        continue;
      }
      let n = 1;
      while (row[x + n] === c) n++;
      rects.push(
        <div
          key={`${x}-${y}`}
          style={{
            position: "absolute",
            left: x * scale,
            top: y * scale,
            width: n * scale,
            height: scale,
            background: pal[c],
          }}
        />,
      );
      x += n;
    }
  });

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: map[0].length * scale,
        height: map.length * scale,
      }}
    >
      {rects}
    </div>
  );
}

/**
 * صورة الـ OG (1200×630): سما، راس الشخصية، الاسم بسطرين (أبيض ودهبي) متل شاشة البداية، وأرض.
 * بتترسم بـ ImageResponse (satori): styles inline بس، وأي div فيه أكتر من ولد لازم يكون display: flex.
 * كل النص بخط Press Start 2P: لا تستعمل رموز برّا الـ ASCII (متل "·")، بتطلع مربعات.
 */
export function OgCard({
  name,
  role,
  stack,
  host,
}: {
  name: string;
  role: string;
  stack: string;
  host: string;
}) {
  const [first, ...rest] = name.toUpperCase().split(" ");
  const shadow = "6px 6px 0 #14142B";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#7EC7F7",
        color: "#fff",
        fontFamily: "Press Start 2P",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 56, padding: "72px 80px 0" }}>
        <Sprite map={HEAD} pal={HERO_PAL} scale={14} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, textShadow: shadow }}>{first}</div>
          <div style={{ fontSize: 64, marginTop: 18, color: "#FFC83D", textShadow: shadow }}>
            {rest.join(" ")}
          </div>
          <div style={{ fontSize: 24, marginTop: 32, color: "#14142B" }}>{role.toUpperCase()}</div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 80px 36px",
          fontSize: 20,
          color: "#14142B",
        }}
      >
        <div>{stack}</div>
        <div>{host}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", height: 96 }}>
        <div style={{ height: 24, background: "#58C44B" }} />
        <div style={{ flex: 1, background: "#B0622F" }} />
      </div>
    </div>
  );
}
