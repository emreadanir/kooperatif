import React from 'react';
import Navbar from '../../components/Navbar'; 
import Footer from '../../components/Footer'; 
import { CheckCircle2, FileText, ShieldCheck, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// ⭐️ YENİ: Teminat maddeleri için Tip Tanımı
interface TeminatMadde {
    title: string;
    desc: string;
}

export default function KrediKullanimSartlari() {

    // Statik string dizileri için özel bir tip tanımlamaya gerek yok, string[] yeterli.

    // ⭐️ YENİ: Teminat maddeleri için tip ataması yapıldı.
    const teminatlar: TeminatMadde[] = [
        { title: "Şahıs Kefaleti", desc: "Kredi limitine göre en az 2 esnaf kefil (Vergi levhalı, oda kayıtlı)" },
        { title: "Gayrimenkul İpoteği", desc: "Daire, dükkan, arsa vb. taşınmazların ipoteği (Ekspertiz değerine göre)" },
        { title: "Araç Rehni", desc: "Ticari veya binek araç üzerine rehin (Kasko değeri üzerinden)" },
        { title: "Bloke Mevduat", desc: "Nakit veya kıymetli evrak blokesi" }
    ];

    // Ortak ve Mali Belgeler listeleri için de doğrudan string[] tipini kullanabiliriz (JSX içinde map edilirken).

    return (
        <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 flex flex-col">
            <Navbar />
            
            {/* Ana Kapsayıcı: Arka plan efektleri */}
            <main className="flex-grow relative overflow-hidden">
                
                {/* --- GLOBAL ARKA PLAN EFEKTLERİ (Mesh Gradient - Zümrüt/Mavi Tema) --- */}
                <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-emerald-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
                    <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
                    <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/10 blur-[90px] rounded-full mix-blend-screen"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-800/15 rounded-full blur-[150px] mix-blend-screen"></div>
                </div>

                {/* --- BAŞLIK BÖLÜMÜ --- */}
                <div className="relative z-10 pt-20 pb-12 lg:pt-24 lg:pb-16 text-center">
                    <div className="container mx-auto px-4">
                        <div className="inline-flex items-center justify-center space-x-3 mb-4 opacity-90">
                            <div className="h-px w-8 bg-gradient-to-r from-transparent to-emerald-400"></div>
                            <span className="text-emerald-400 font-bold tracking-[0.25em] uppercase text-xs md:text-sm">BAŞVURU REHBERİ</span>
                            <div className="h-px w-8 bg-gradient-to-l from-transparent to-emerald-400"></div>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl">
                        Kredi Kullanım <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-indigo-400">Şartları</span>
                        </h1>
                        
                        <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
                        Kooperatifimiz kefaletiyle kredi kullanabilmek için gerekli olan temel şartlar, istenen belgeler ve teminat koşulları.
                        </p>
                        
                        <div className="mt-12 w-full max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
                    </div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-20">
                    
                    {/* 1. BÖLÜM: TEMEL ŞARTLAR (Grid Kartlar) */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                <UserCheck className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Kimler Kredi Kullanabilir?</h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                "Esnaf ve Sanatkarlar Odası'na kayıtlı olmak",
                                "Vergi levhasına sahip aktif esnaf olmak",
                                "Kooperatifimiz çalışma bölgesinde (İkamet/İşyeri) bulunmak",
                                "Aynı anda başka bir Esnaf Kefalet Kooperatifi ortağı olmamak",
                                "Kredi notunun banka kriterlerine uygun olması",
                                "Halkbank tarafından belirlenen mali kriterleri taşımak"
                            ].map((item: string, idx: number) => ( // Tip atamaları yapıldı
                                <div key={idx} className="group p-6 bg-slate-800/40 border border-slate-700/60 rounded-2xl hover:bg-slate-800/60 transition-all duration-300 hover:border-emerald-500/30 flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                                    <p className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. BÖLÜM: TEMİNATLAR (Özel Vurgulu Alan) */}
                    <div className="relative rounded-3xl overflow-hidden border border-indigo-500/20 bg-gradient-to-br from-slate-900/80 to-indigo-900/20 p-8 lg:p-12">
                        {/* Arkaplan Işıltısı */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                        
                        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                                        <ShieldCheck className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Teminat Koşulları</h2>
                                </div>
                                <p className="text-slate-400 leading-relaxed mb-6">
                                    Kredi kullanımında kooperatifimizin ve bankanın riskini teminat altına almak amacıyla, kredi tutarına ve kişinin mali durumuna göre aşağıdaki teminatlar istenmektedir.
                                </p>
                                <div className="flex items-start gap-3 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                    <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                                    <p className="text-indigo-200 text-sm">
                                        Teminat türü ve miktarı, talep edilen kredi limitine göre Yönetim Kurulu tarafından belirlenir.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {teminatlar.map((item, idx: number) => ( // Tip atamaları yapıldı
                                    <div key={idx} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-indigo-400/30 transition-colors">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm">{item.title}</h4>
                                            <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. BÖLÜM: GEREKLİ BELGELER (İki Kolonlu Liste) */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <FileText className="w-6 h-6 text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Başvuru İçin Gerekli Belgeler</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Ortak Belgeler */}
                            <div className="bg-slate-800/30 border border-slate-700/60 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-blue-400 mb-4 pb-2 border-b border-slate-700">Ortak Belgeler</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Nüfus Cüzdanı Fotokopisi (Aslı ile)",
                                        "Vergi Levhası Fotokopisi (Son dönem)",
                                        "Oda Faaliyet Belgesi (Yeni tarihli)",
                                        "İkametgah Belgesi (E-Devlet)",
                                        "İmza Sirküleri / Beyannamesi"
                                    ].map((doc: string, i: number) => ( // Tip atamaları yapıldı
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                                            {doc}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Mali Belgeler */}
                            <div className="bg-slate-800/30 border border-slate-700/60 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-blue-400 mb-4 pb-2 border-b border-slate-700">Mali Belgeler</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Son 3 yıla ait Bilanço ve Gelir Tablosu (Onaylı)",
                                        "Son dönem Geçici Vergi Beyannamesi",
                                        "Ticaret Sicil Gazetesi (Kuruluş ve son değişiklikler)",
                                        "Varsa mal varlığı dökümü (Tapu, Ruhsat fotokopileri)",
                                        "Kefiller için de aynı evraklar talep edilir"
                                    ].map((doc: string, i: number) => ( // Tip atamaları yapıldı
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                                            {doc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* ALT ÇAĞRI ALANI (CTA) */}
                    <div className="mt-16 text-center">
                        <p className="text-slate-400 mb-6">
                            Şartları sağlıyor musunuz? Hemen ön başvurunuzu yapın, size dönüş yapalım.
                        </p>
                        <Link href="/iletisim">
                            <button className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-900/30 transition-all transform hover:scale-105 flex items-center justify-center gap-2 mx-auto">
                                Bize Ulaşın
                                <ArrowRight size={20} />
                            </button>
                        </Link>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}