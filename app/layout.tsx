import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 1. Next.js'ten gerekli tipleri içe aktarın
import { Metadata } from 'next'; 
import React from "react"; // React.ReactNode için bu import gerekli

// Font tanımlamaları
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 2. Metadata objesine tip ataması yapın
export const metadata: Metadata = {
  title: "S.S. Esnaf ve Sanatkarlar Kredi Kooperatifi",
  description: "Esnaf ve sanatkarlarımızın finansal ihtiyaçlarına yönelik çözümler sunan kredi kooperatifi resmi web sitesi.",
};

// 3. Bileşen props'u için arayüz (Interface) tanımlayın
interface RootLayoutProps {
  // children prop'unun tipi React.ReactNode olmalıdır (diğer bileşenleri/sayfaları temsil eder)
  children: React.ReactNode; 
}

// 4. Bileşen fonksiyonuna tanımlanan props arayüzünü uygulayın
export default function RootLayout({
  children,
}: RootLayoutProps) {
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