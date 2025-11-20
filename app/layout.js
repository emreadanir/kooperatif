import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Font tanımlamaları (TypeScript tipi kaldırıldı)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata objesi (TypeScript tipi kaldırıldı)
export const metadata = {
  title: "S.S. Esnaf ve Sanatkarlar Kredi Kooperatifi",
  description: "Esnaf ve sanatkarlarımızın finansal ihtiyaçlarına yönelik çözümler sunan kredi kooperatifi resmi web sitesi.",
};

// Fonksiyon imzasındaki tip tanımlamaları kaldırıldı
export default function RootLayout({
  children,
}) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}