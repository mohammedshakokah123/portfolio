import type { Metadata } from "next";
import Link from "next/link";

// الـ robots صريح: غير هيك بيورث "index, follow" من الـ layout جنب الـ noindex اللي Next بيحطه لحاله
export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div style={{ padding: "120px 20px" }}>
      <h1 style={{ fontSize: 28, color: "#fff", textShadow: "var(--o3)" }}>Page not found</h1>
      <p style={{ color: "var(--ink)", marginTop: 16 }}>
        <Link href="/">Back home</Link>
      </p>
    </div>
  );
}
