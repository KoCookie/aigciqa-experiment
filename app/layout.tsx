import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Experiment App",
  description: "Image judging experiment",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
