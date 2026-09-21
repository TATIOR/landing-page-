import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Institutional Trading Academy",
  description: "Build a disciplined trading process with Institutional Trading Academy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
