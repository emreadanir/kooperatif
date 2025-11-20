"use client"; 

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link'; 
import { Users, ShieldCheck, FileText, ArrowRight, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 flex flex-col">
      <Navbar />

      {/* Ana Kapsayıcı: Tüm arka plan efektleri */}
      <main className="flex-grow relative overflow-hidden">
        
        {/* --- GLOBAL ARKA PLAN EFEKTLERİ (Mesh Gradient) --- */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Sol Üst - Altın Işıltısı (Zenginlik/Güç) */}
            <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-[120px] mix-blend-screen"></div>
            
            {/* Sağ Üst - İndigo Işıltısı (Kurumsallık) */}
            <div className="absolute top-[5%] right-[-5%] w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[100px] mix-blend-screen"></div>
            
            {/* Orta Alt - Yumuşak Geçiş */}
            <div className="absolute bottom-[10%] left-1/3 w-[900px] h-[500px] bg-slate-700/20 blur-[120px] rounded-full mix-blend-screen"></div>
        </div>

        {/* --- HERO SECTION (GİRİŞ) --- */}
        <section className="relative z-10 pt-20 pb-24 lg:pt-32 lg:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-16">
            
            {/* Sol Taraf: Metin ve Butonlar */}
            <div className="lg:w-1/2 text-center lg:text-left">
              {/* Rozet */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                Güçlü Esnaf, Güçlü Gelecek
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-2xl">
                Esnafımızın <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-500 to-amber-700">Yanındayız.</span>
              </h1>
              
              <p className="text-slate-400 text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                Düşük faizli kredi imkanları, esnek ödeme koşulları ve devlet destekli finansman çözümleriyle işletmenizi büyütmek için buradayız.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link href="/iletisim">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-lg shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-105 hover:shadow-indigo-500/40">
                    Bize Ulaşın
                  </button>
                </Link>
                <Link href="/isletme-kredisi">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 text-slate-200 font-bold text-lg backdrop-blur-sm transition-all flex items-center justify-center gap-2 group">
                    Kredi Detayları <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Sağ Taraf: Cam Efektli Bilgi Kartı (Glassmorphism) */}
            <div className="lg:w-5/12 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-indigo-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                  <div className="space-y-6">
                      <div className="flex items-center gap-5">
                        <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                           <ShieldCheck size={32} className="text-amber-400"/>
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-white">Devlet Destekli</h3>
                          <p className="text-sm text-slate-400">Hazine destekli düşük faiz oranları</p>
                        </div>
                      </div>
                      
                      <div className="w-full h-px bg-slate-700/50"></div>

                      <div className="flex items-center gap-5">
                        <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                           <Users size={32} className="text-indigo-400"/>
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-white">Güçlü Ortaklık</h3>
                          <p className="text-sm text-slate-400">Binlerce mutlu esnaf ortağımız</p>
                        </div>
                      </div>

                      <div className="w-full h-px bg-slate-700/50"></div>

                      <div className="mt-2 bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                        <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold mb-1">
                          <CheckCircle size={16} />
                          <span>Hızlı Onay Süreci</span>
                        </div>
                        <p className="text-xs text-slate-500">Başvurularınız aynı gün değerlendirmeye alınır.</p>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- HIZLI ERİŞİM KARTLARI --- */}
        <section className="relative z-10 py-20">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                  Hizmetlerimiz
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-amber-500 mx-auto rounded-full"></div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                 {/* Kart 1 */}
                 <div className="group p-8 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700 hover:border-amber-500/30 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[50px] -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-0"></div>
                    
                    <Users className="w-12 h-12 text-amber-400 mb-6"/>
                    <h3 className="text-2xl font-bold text-white mb-3">Yönetim Kadromuz</h3>
                    <p className="text-slate-400 mb-6 text-sm leading-relaxed">Deneyimli ve güvenilir ekibimizle tanışın, kooperatifimizi daha yakından tanıyın.</p>
                    
                    <Link href="/yonetim-kurulu" className="inline-flex items-center text-amber-400 font-semibold hover:text-amber-300 transition-colors group-hover:gap-2">
                      İncele <ArrowRight size={16} className="ml-1"/>
                    </Link>
                 </div>

                 {/* Kart 2 */}
                 <div className="group p-8 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700 hover:border-indigo-500/30 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px] -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-0"></div>

                    <FileText className="w-12 h-12 text-indigo-400 mb-6"/>
                    <h3 className="text-2xl font-bold text-white mb-3">Kredi Koşulları</h3>
                    <p className="text-slate-400 mb-6 text-sm leading-relaxed">İşletme, yatırım ve taşıt kredisi seçeneklerimiz ve uygun faiz oranlarımız.</p>
                    
                    <Link href="/isletme-kredisi" className="inline-flex items-center text-indigo-400 font-semibold hover:text-indigo-300 transition-colors group-hover:gap-2">
                      Detaylar <ArrowRight size={16} className="ml-1"/>
                    </Link>
                 </div>

                 {/* Kart 3 */}
                 <div className="group p-8 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700 hover:border-cyan-500/30 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[50px] -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-0"></div>

                    <ShieldCheck className="w-12 h-12 text-cyan-400 mb-6"/>
                    <h3 className="text-2xl font-bold text-white mb-3">Mevzuat</h3>
                    <p className="text-slate-400 mb-6 text-sm leading-relaxed">Kooperatif ana sözleşmesi, kanunlar ve yasal yönetmelikler hakkında bilgi alın.</p>
                    
                    <Link href="/kanun-ve-yonetmelikler" className="inline-flex items-center text-cyan-400 font-semibold hover:text-cyan-300 transition-colors group-hover:gap-2">
                      Oku <ArrowRight size={16} className="ml-1"/>
                    </Link>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}