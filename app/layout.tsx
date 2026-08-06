import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Number Quest Adventures",
  description: "Dinosaur and monster-truck maths adventures for young explorers.",
  applicationName: "Number Quest Adventures",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Number Quest",
  },
  formatDetection: {
    telephone: false,
  },
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
