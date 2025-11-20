"use client";

import React, { useCallback } from 'react'; // useCallback eklendi
import Link from 'next/link';
import { Phone, Mail, MapPin, Landmark, Facebook, Twitter, Instagram, ChevronRight, ArrowRight, LucideIcon } from 'lucide-react';

// ⭐️ YENİ: Link öğeleri için Tip Tanımı
interface LinkItem {
    name: string;
    href: string;
}

// ⭐️ YENİ: Footer bileşenine tip ataması yapıldı
const Footer: React.FC = () => {
  
  // ⭐️ YENİ: scrollToTop fonksiyonuna tip ataması yapıldı
  const scrollToTop = useCallback((): void => {
    // window nesnesinin varlığını kontrol ediyoruz (Next.js SSR uyumluluğu için)
    if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Hızlı Erişim Linkleri (Tip uygulaması yapıldı)
  const quickAccessLinks: LinkItem[] = [
    { name: 'Anasayfa', href: '/' },
    { name: 'Kredi Çeşitleri', href: '/kredi-cesitleri' },
    { name: 'Kredi Hesaplama', href: '/kredi-kullanim-sartlari' },
    { name: 'Personel Kadrosu', href: '/personel-kadrosu' },
  ];

  // Mevzuat Linkleri (Sadece isimleri içeren bir string dizisi, URL'ler tekrar ediyor)
  const mevzuatNames: string[] = [
    'Ana Sözleşme',
    'Esnaf ve Sanatkarlar Kanunu',
    'Kredi Yönetmeliği',
    'Bilgi Edinme Hakkı'
  ];
  
  // Sosyal Medya İkonları dizisi (LucideIcon tipini kullanıyoruz)
  const socialIcons: LucideIcon[] = [Facebook, Twitter, Instagram];

  return (
    <footer className="relative bg-[#0f172a] pt-24 pb-10 overflow-hidden border-t border-slate-800">
      
      {/* --- ARKA PLAN IŞIK EFEKTLERİ (Mesh Gradient) --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {/* Sol Alt Köşe - Amber Işıltısı */}
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
        {/* Sağ Alt Köşe - İndigo Işıltısı */}
        <div className="absolute bottom-[10%] right-[-5%] w-[700px] h-[700px] bg-indigo-900/20 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. SÜTUN: KURUMSAL KİMLİK */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center cursor-pointer group w-fit" onClick={scrollToTop}>
              <div className="relative p-2 rounded-xl mr-3 overflow-hidden group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-shadow duration-300 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Landmark className="h-7 w-7 text-amber-400 relative z-10" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-white leading-tight tracking-wide">ESNAF KEFALET</span>
                <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">KREDİ KOOPERATİFİ</span>
              </div>
            </Link>
            
            <p className="text-slate-400 text-sm leading-relaxed">
              Esnaf ve sanatkarlarımızın finansal ihtiyaçlarına çözüm üretmek, dayanışmayı artırmak ve geleceğe güvenle bakmalarını sağlamak için buradayız.
            </p>

            {/* Sosyal Medya İkonları */}
            <div className="flex gap-4 pt-2">
              {socialIcons.map((Icon, index: number) => (
                <a key={index} href="#" className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300 shadow-lg hover:shadow-indigo-500/30">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. SÜTUN: HIZLI ERİŞİM */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-amber-500 rounded-full"></span>
              Hızlı Erişim
            </h4>
            <ul className="space-y-3">
              {quickAccessLinks.map((item: LinkItem, idx: number) => (
                <li key={idx}>
                  <Link 
                    href={item.href} 
                    className="group flex items-center text-slate-400 hover:text-amber-400 text-sm transition-colors"
                  >
                    <ChevronRight size={14} className="mr-2 text-slate-600 group-hover:text-amber-500 transition-colors" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. SÜTUN: MEVZUAT & BİLGİ */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-indigo-500 rounded-full"></span>
              Mevzuat
            </h4>
            <ul className="space-y-3">
              {mevzuatNames.map((item: string, idx: number) => (
                <li key={idx}>
                  <Link 
                    href="/kanun-ve-yonetmelikler" 
                    className="group flex items-center text-slate-400 hover:text-indigo-400 text-sm transition-colors"
                  >
                    <ArrowRight size={14} className="mr-2 text-slate-600 group-hover:text-indigo-500 transition-colors" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. SÜTUN: İLETİŞİM */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-cyan-500 rounded-full"></span>
              Bize Ulaşın
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-center text-amber-500 shrink-0 group-hover:border-amber-500/50 transition-colors">
                  <MapPin size={20} />
                </div>
                <span className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                  Cumhuriyet Mah. Atatürk Cad. No:123<br/>Merkez / TÜRKİYE
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-center text-indigo-500 shrink-0 group-hover:border-indigo-500/50 transition-colors">
                  <Phone size={20} />
                </div>
                <span className="text-slate-400 text-sm group-hover:text-slate-200 transition-colors">
                  0 (212) 123 45 67
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-center text-cyan-500 shrink-0 group-hover:border-cyan-500/50 transition-colors">
                  <Mail size={20} />
                </div>
                <span className="text-slate-400 text-sm group-hover:text-slate-200 transition-colors">
                  bilgi@kooperatif.org.tr
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* --- ALT BİLGİ (COPYRIGHT) --- */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 relative">
            {/* Üstteki çizgiye parlama efekti */}
            <div className="absolute top-[-1px] left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-500/50 to-transparent"></div>
            
          <p className="text-slate-500 text-sm text-center md:text-left">
            © 2024 <span className="text-slate-300 font-semibold">S.S. Esnaf ve Sanatkarlar Kredi ve Kefalet Kooperatifi</span>. Tüm hakları saklıdır.
          </p>
          
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="#" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
            <Link href="#" className="hover:text-white transition-colors">Kullanım Şartları</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;