import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata={title:"TATIOR — Technology that works.",description:"TATIOR — Laptops, phones, accessories and technology."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr"><body>{children}</body></html>}