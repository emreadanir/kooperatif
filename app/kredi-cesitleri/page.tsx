"use client";

import React, { useState, useEffect } from 'react';
// ⭐️ DÜZELTME: Import yollarını garantiye almak için mutlak yol (@/) kullanıyoruz
import Navbar from '@/components/Navbar'; 
import Footer from '@/components/Footer'; 
import { 
  Briefcase, Building2, Truck, Wallet, CreditCard, 
  CheckCircle2, Loader2 
} from 'lucide-react';
import Link from 'next/link';

// Firebase imports
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db, appId } from '@/lib/firebase';

// Kredi Veri Tipi
interface CreditType {
  id: string;
  title: string;
  description: string;
  features: string[];
  iconName: string;
  color: 'amber' | 'indigo' | 'cyan';
  link?: string;
}

// İkon Eşleştirme Haritası
const iconMap: { [key: string]: any } = {
  Briefcase,
  Building2,
  Truck,
  Wallet,
  CreditCard
};

export default function KrediCesitleri() {
  const [credits, setCredits] = useState<CreditType[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // 1. Anonim Giriş
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else signInAnonymously(auth).catch((err) => console.error("Auth Error:", err));
    });
    return () => unsub();
  }, []);

  // 2. Veri Çekme
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'artifacts', appId, 'public', 'data', 'credit-types'),
      orderBy('order', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CreditType[];
      
      setCredits(data);
      setLoading(false);
    }, (err) => {
      console.error("Data fetch error", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 flex flex-col">
      <Navbar />
      
      {/* Ana Kapsayıcı: Arka plan efektleri */}
      <main className="flex-grow relative overflow-hidden">
        
        {/* --- GLOBAL ARKA PLAN EFEKTLERİ --- */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-[120px] mix-blend-screen"></div>
            <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/10 blur-[90px] rounded-full mix-blend-screen"></div>
            <div className="absolute top-[60%] right-[-15%] w-[800px] h-[800px] bg-slate-600/15 rounded-full blur-[140px] mix-blend-screen"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-cyan-900/15 rounded-full blur-[150px] mix-blend-screen"></div>
        </div>

        {/* --- BAŞLIK BÖLÜMÜ --- */}
        <div className="relative z-10 pt-28 pb-12 lg:pt-40 lg:pb-16 text-center">
            <div className="container mx-auto px-4">
                <div className="inline-flex items-center justify-center space-x-3 mb-4 opacity-90">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-emerald-400"></div>
                    <span className="text-emerald-400 font-bold tracking-[0.25em] uppercase text-xs md:text-sm">FİNANSAL ÇÖZÜMLER</span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-emerald-400"></div>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl">
                  Kredi <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-200 to-amber-500">Çeşitleri</span>
                </h1>
                
                <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
                  İşletmenizi büyütmek, yeni bir iş yeri almak veya aracınızı yenilemek için size en uygun finansman desteğini sunuyoruz.
                </p>
                
                <div className="mt-12 w-full max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
            </div>
        </div>

        {/* --- KREDİ KARTLARI --- */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            
            {loading ? (
               <div className="flex justify-center py-20">
                  <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
               </div>
            ) : (
                // ⭐️ DÜZELTME: gap-8 yerine -m-4 (negatif margin) kullanıldı
                <div className="flex flex-wrap justify-center -m-4">
                    {credits.map((credit) => {
                        // Renk temasına göre sınıfları belirle
                        const colorClasses = {
                            amber: "text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:border-amber-500/40 group-hover:shadow-amber-500/10",
                            indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:border-indigo-500/40 group-hover:shadow-indigo-500/10",
                            cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 group-hover:border-cyan-500/40 group-hover:shadow-cyan-500/10",
                        }[credit.color] || "text-slate-400 bg-slate-800 border-slate-700";

                        const IconComponent = iconMap[credit.iconName] || Briefcase;

                        return (
                            // ⭐️ DÜZELTME: Kart, p-4 (padding) olan bir wrapper içine alındı.
                            // Genişlikler % olarak (1/2, 1/3) verildiği için taşma yapmaz.
                            <div key={credit.id} className="w-full md:w-1/2 lg:w-1/3 p-4">
                                <div className={`group flex flex-col h-full bg-slate-800/40 backdrop-blur-sm border border-slate-700/60 rounded-3xl p-8 transition-all duration-300 hover:bg-slate-800/60 hover:-translate-y-2 hover:shadow-2xl ${colorClasses.split(' ').pop()}`}>
                                    
                                    {/* İkon */}
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${colorClasses.split(' ').slice(1, 3).join(' ')}`}>
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
                                    <ul className="space-y-3">
                                        {credit.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start text-sm text-slate-300">
                                                <CheckCircle2 size={16} className={`mr-2 mt-0.5 shrink-0 ${colorClasses.split(' ')[0]}`} />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Eğer hiç veri yoksa */}
            {!loading && credits.length === 0 && (
                <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-slate-700/50">
                    <p className="text-slate-400 text-lg">Henüz kredi çeşitleri eklenmemiş.</p>
                    <p className="text-slate-500 text-sm mt-2">Yönetim panelinden içerik ekleyebilirsiniz.</p>
                </div>
            )}

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
                    <Link href="/kredi-hesaplama">
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