import React from 'react';
import Navbar from '../../components/Navbar'; 
import Footer from '../../components/Footer'; 
import { Percent, TrendingDown, Calendar, Info } from 'lucide-react';
import Link from 'next/link';

// ⭐️ YENİ: Bileşene tip ataması yapıldı
const FaizOrani: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 flex flex-col">
      <Navbar />
      
      {/* Ana Kapsayıcı: Arka plan efektleri */}
      <main className="flex-grow relative overflow-hidden">
        
        {/* --- GLOBAL ARKA PLAN EFEKTLERİ (Mesh Gradient - Finans Odaklı) --- */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Üst Sağ - Zümrüt Işıltısı */}
            <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-screen"></div>
            
            {/* Üst Sol - Mavi Vurgu */}
            <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
            
            {/* Orta Bölüm - İndigo Geçiş */}
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/10 blur-[90px] rounded-full mix-blend-screen"></div>

            {/* Alt Kısımlar - Devamlılık */}
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-900/15 rounded-full blur-[150px] mix-blend-screen"></div>
        </div>

        {/* --- BAŞLIK BÖLÜMÜ --- */}
        <div className="relative z-10 pt-20 pb-12 lg:pt-24 lg:pb-16 text-center">
            <div className="container mx-auto px-4">
                <div className="inline-flex items-center justify-center space-x-3 mb-4 opacity-90">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-emerald-400"></div>
                    <span className="text-emerald-400 font-bold tracking-[0.25em] uppercase text-xs md:text-sm">GÜNCEL & AVANTAJLI</span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-emerald-400"></div>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl">
                  Faiz <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-blue-500">Oranları</span>
                </h1>
                
                <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
                  Esnafımıza özel, devlet destekli ve piyasa koşullarına göre en uygun kredi faiz oranları.
                </p>
                
                <div className="mt-12 w-full max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
            </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            
            {/* BÜYÜK FAİZ KARTI */}
            <div className="relative group">
                {/* Arkaplan Parlaması */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                
                <div className="relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 md:p-16 text-center overflow-hidden">
                    
                    {/* Dekoratif Daireler */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-16 -mb-16"></div>

                    <div className="relative z-10 flex flex-col items-center justify-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold uppercase tracking-wider mb-8">
                            <TrendingDown size={16} />
                            Yıllık Faiz Oranı
                        </div>

                        <div className="flex items-baseline justify-center font-extrabold text-white drop-shadow-lg">
                            <span className="text-4xl md:text-6xl text-slate-400 mr-2">%</span>
                            <span className="text-8xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tighter">25</span>
                            <span className="text-4xl md:text-6xl text-slate-400 ml-1">,00</span>
                        </div>

                        <p className="text-slate-400 mt-8 max-w-lg mx-auto text-lg">
                            Halkbank kaynaklı kredilerde uygulanan güncel yıllık faiz oranıdır.
                        </p>
                    </div>
                </div>
            </div>

            {/* DETAY BİLGİLERİ GRID */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
                
                {/* Vade Seçenekleri */}
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Calendar size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Vade Seçenekleri</h3>
                    </div>
                    <ul className="space-y-4">
                        <li className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-3 last:border-0">
                            <span className="text-slate-400">İşletme Kredisi</span>
                            <span className="text-white font-semibold">60 Aya Kadar</span>
                        </li>
                        <li className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-3 last:border-0">
                            <span className="text-slate-400">Yatırım Kredisi</span>
                            <span className="text-white font-semibold">120 Aya Kadar</span>
                        </li>
                        <li className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-3 last:border-0">
                            <span className="text-slate-400">Ödeme Periyodu</span>
                            <span className="text-white font-semibold">1 - 3 - 6 Aylık</span>
                        </li>
                    </ul>
                </div>

                {/* Kesinti ve Masraflar */}
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <Percent size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Kesinti Oranları</h3>
                    </div>
                    <ul className="space-y-4">
                        <li className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-3 last:border-0">
                            <span className="text-slate-400">Bloke Sermaye</span>
                            <span className="text-white font-semibold">%1.5</span>
                        </li>
                        <li className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-3 last:border-0">
                            <span className="text-slate-400">Bölge Birliği Payı</span>
                            <span className="text-white font-semibold">%0.25</span>
                        </li>
                        <li className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-3 last:border-0">
                            <span className="text-slate-400">Masraf Karşılığı</span>
                            <span className="text-white font-semibold">%1.25</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* DİPNOT / UYARI */}
            <div className="mt-8 flex items-start gap-4 p-6 bg-indigo-900/10 border border-indigo-500/20 rounded-xl">
                <Info className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-sm text-indigo-200/80 leading-relaxed">
                    <p>
                        Belirtilen faiz oranları ve kesintiler, piyasa koşullarına ve Hazine ve Maliye Bakanlığı'nın düzenlemelerine göre değişkenlik gösterebilir. Güncel oranlar için lütfen kooperatifimizle iletişime geçiniz.
                    </p>
                </div>
            </div>

            {/* CTA Butonu */}
            <div className="mt-12 text-center">
                <Link href="/kredi-kullanim-sartlari">
                    <button className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-900/30 transition-all transform hover:scale-105">
                        Kredi Hesaplama Aracına Git
                    </button>
                </Link>
            </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default FaizOrani;