import React from 'react';
import Navbar from '../../components/Navbar'; 
import Footer from '../../components/Footer'; 
// Lucide ikonlarını import ediyoruz
import { Briefcase, Building2, Truck, CheckCircle2, ArrowRight, Wallet, LucideIcon } from 'lucide-react';
import Link from 'next/link';

// ⭐️ YENİ: CreditType Arayüzü
interface CreditType {
  id: number;
  title: string;
  // Lucide ikonları birer React bileşeni olduğu için tipini LucideIcon olarak belirledik
  icon: LucideIcon; 
  description: string;
  features: string[];
  // color alanını sınırlı string tipleriyle belirledik (kod güvenliği için)
  color: "amber" | "indigo" | "cyan"; 
  link: string;
}


// Kredi Veri Seti (Tip uygulaması yapıldı)
const creditTypes: CreditType[] = [
  {
    id: 1,
    title: "İşletme Kredisi",
    icon: Briefcase,
    description: "Esnaf ve sanatkarlarımızın hammadde, döner sermaye ve diğer işletme giderlerini karşılamak amacıyla kullandırılan, uygun faizli ve uzun vadeli kredi desteğidir.",
    features: [
      "60 Aya Varan Vade İmkanı",
      "3 Ayda Bir veya Aylık Ödeme",
      "Düşük Faiz Oranı",
      "Esnek Ödeme Planı"
    ],
    color: "amber", // Tema rengi
    link: "/isletme-kredisi"
  },
  {
    id: 2,
    title: "İşyeri Edindirme Kredisi",
    icon: Building2,
    description: "Faaliyet gösterdiği işyerini satın almak isteyen esnaflarımıza özel, mülkiyet sahibi olmalarını kolaylaştıran uzun vadeli finansman çözümüdür.",
    features: [
      "120 Aya Varan Vade",
      "İşyeri Değerinin %100'üne Kadar",
      "Kira Öder Gibi İşyeri Sahibi Olun",
      "Tapu Masraflarında Destek"
    ],
    color: "indigo",
    link: "/kredi-kullanim-sartlari"
  },
  {
    id: 3,
    title: "Taşıt Edindirme Kredisi",
    icon: Truck,
    description: "Mesleki faaliyetlerinde kullanmak üzere sıfır veya ikinci el ticari araç satın almak isteyen esnaflarımıza yönelik taşıt kredisidir.",
    features: [
      "84 Aya Varan Vade",
      "Sıfır ve 2. El Araç Desteği",
      "Uygun Kasko ve Sigorta",
      "Hızlı Onay Süreci"
    ],
    color: "cyan",
    link: "/kredi-kullanim-sartlari"
  }
];

export default function KrediCesitleri() {
  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 flex flex-col">
      <Navbar />
      
      {/* Ana Kapsayıcı: Arka plan efektleri */}
      <main className="flex-grow relative overflow-hidden">
        
        {/* --- GLOBAL ARKA PLAN EFEKTLERİ (Mesh Gradient - Finans Teması) --- */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Üst Sağ - Zenginlik (Amber/Gold) */}
            <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-[120px] mix-blend-screen"></div>
            
            {/* Üst Sol - Finans/Güven (Emerald/Green) */}
            <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
            
            {/* Orta Bölüm - Kurumsallık (Indigo) */}
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/10 blur-[90px] rounded-full mix-blend-screen"></div>

            {/* Alt Kısımlar - Devamlılık */}
            <div className="absolute top-[60%] right-[-15%] w-[800px] h-[800px] bg-slate-600/15 rounded-full blur-[140px] mix-blend-screen"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-cyan-900/15 rounded-full blur-[150px] mix-blend-screen"></div>
        </div>

        {/* --- BAŞLIK BÖLÜMÜ --- */}
        <div className="relative z-10 pt-20 pb-12 lg:pt-24 lg:pb-16 text-center">
            <div className="container mx-auto px-4">
                
                {/* Üst Başlık */}
                <div className="inline-flex items-center justify-center space-x-3 mb-4 opacity-90">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-emerald-400"></div>
                    <span className="text-emerald-400 font-bold tracking-[0.25em] uppercase text-xs md:text-sm">FİNANSAL ÇÖZÜMLER</span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-emerald-400"></div>
                </div>
                
                {/* Ana Başlık */}
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl">
                  Kredi <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-200 to-amber-500">Çeşitleri</span>
                </h1>
                
                {/* Açıklama */}
                <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
                  İşletmenizi büyütmek, yeni bir iş yeri almak veya aracınızı yenilemek için size en uygun finansman desteğini sunuyoruz.
                </p>
                
                <div className="mt-12 w-full max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
            </div>
        </div>

        {/* --- KREDİ KARTLARI --- */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            
            <div className="grid lg:grid-cols-3 gap-8">
                {creditTypes.map((credit) => {
                    // Renk temasına göre sınıfları belirle
                    const colorClasses: string = { // Tip ataması yapıldı
                        amber: "text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:border-amber-500/40 group-hover:shadow-amber-500/10",
                        indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:border-indigo-500/40 group-hover:shadow-indigo-500/10",
                        cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 group-hover:border-cyan-500/40 group-hover:shadow-cyan-500/10",
                    }[credit.color];

                    const btnColorClasses: string = { // Tip ataması yapıldı
                        amber: "hover:text-amber-300",
                        indigo: "hover:text-indigo-300",
                        cyan: "hover:text-cyan-300",
                    }[credit.color];

                    // İkon bileşenini dinamik olarak Credit.icon olarak alıyoruz
                    const IconComponent = credit.icon;

                    return (
                        <div key={credit.id} className={`group flex flex-col h-full bg-slate-800/40 backdrop-blur-sm border border-slate-700/60 rounded-3xl p-8 transition-all duration-300 hover:bg-slate-800/60 hover:-translate-y-2 hover:shadow-2xl ${colorClasses.split(' ').pop()}`}>
                            
                            {/* İkon */}
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${colorClasses.split(' ').slice(1, 3).join(' ')}`}>
                                {/* İkon, tipi LucideIcon olduğu için doğru çalışacaktır. */}
                                <IconComponent size={32} className={`${colorClasses.split(' ')[0]}`} />
                            </div>

                            {/* Başlık & Açıklama */}
                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white/90 transition-colors">
                                {credit.title}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
                                {credit.description}
                            </p>

                            {/* Özellikler Listesi */}
                            <ul className="space-y-3 mb-8">
                                {credit.features.map((feature, idx: number) => ( // idx'e tip atandı
                                    <li key={idx} className="flex items-start text-sm text-slate-300">
                                        <CheckCircle2 size={16} className={`mr-2 mt-0.5 shrink-0 ${colorClasses.split(' ')[0]}`} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Buton */}
                            <Link href={credit.link}>
                                <button className={`w-full py-4 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 group/btn border border-transparent hover:border-slate-600 ${btnColorClasses}`}>
                                    Detaylı Bilgi
                                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    );
                })}
            </div>

            {/* Alt Bilgi Alanı */}
            <div className="mt-16 relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900/40 to-slate-900/40 border border-indigo-500/20 p-8 md:p-12 text-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="relative z-10">
                    <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-full mb-4">
                        <Wallet className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Kredi Hesaplama Aracı</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto mb-8">
                        İhtiyacınız olan kredi tutarını ve vadeyi belirleyerek tahmini ödeme planınızı hemen oluşturabilirsiniz.
                    </p>
                    <Link href="/kredi-kullanim-sartlari">
                        <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all transform hover:scale-105">
                            Hemen Hesapla
                        </button>
                    </Link>
                </div>
            </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}