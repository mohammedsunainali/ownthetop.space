import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OwnTheTop — Claim your space",
  description: "A live 3D competitive skyline for companies, products, and people.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
