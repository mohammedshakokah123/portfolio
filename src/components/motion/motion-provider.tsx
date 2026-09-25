// Pass-through for now; phase 09 wires up Motion (LazyMotion + reduced-motion config).
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
