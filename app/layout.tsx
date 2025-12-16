import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "League Registration Form Auto-Filler",
  description: "Generate browser console scripts to auto-fill league registration forms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

