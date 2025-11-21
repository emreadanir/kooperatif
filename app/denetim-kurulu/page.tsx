"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar'; 
import Footer from '../../components/Footer'; 
import { Loader2 } from 'lucide-react';

// Firebase imports
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db, appId } from '@/lib/firebase';

// Üye Tipi Tanımı
interface AuditMember {
  id: string;
  name: string;
  title: string;
  image: string;
  order: number;
}

export default function DenetimKurulu() {
  const [members, setMembers] = useState<AuditMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // 1. Firebase Oturum
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
      collection(db, 'artifacts', appId, 'public', 'data', 'audit-members'),
      orderBy('order', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AuditMember[];
      
      setMembers(data);
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
      
      <main className="flex-grow relative overflow-hidden">
        
        {/* --- PLATİN/GÜMÜŞ TEMA ARKA PLAN EFEKTLERİ --- */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-slate-500/20 rounded-full blur-[120px] mix-blend-screen"></div>
            <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[100px] mix-blend-screen"></div>
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-slate-400/10 blur-[90px] rounded-full mix-blend-screen"></div>
            <div className="absolute top-[60%] right-[-15%] w-[800px] h-[800px] bg-slate-600/15 rounded-full blur-[140px] mix-blend-screen"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-cyan-800/15 rounded-full blur-[150px] mix-blend-screen"></div>
        </div>

        {/* --- BAŞLIK BÖLÜMÜ --- */}
        <div className="relative z-10 pt-28 pb-12 lg:pt-40 lg:pb-16 text-center">
            <div className="container mx-auto px-4">
                <div className="inline-flex items-center justify-center space-x-3 mb-4 opacity-90">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-slate-400"></div>
                    <span className="text-slate-300 font-bold tracking-[0.25em] uppercase text-xs">ŞEFFAFLIK & GÜVEN</span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-slate-400"></div>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight drop-shadow-2xl">
                  Denetim <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-cyan-200 to-slate-400">Kurulu</span>
                </h1>
                
                <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
                  Kooperatifimizin işleyişini, mali yapısını ve mevzuata uygunluğunu denetleyen yetkili organımız.
                </p>
                
                <div className="mt-8 w-full max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
            </div>
        </div>

        {/* --- ÜYE KARTLARI BÖLÜMÜ --- */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            
            {loading ? (
               <div className="flex justify-center py-20">
                  <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
               </div>
            ) : (
                <>
                    {/* Grid Yapısı - Üyeler merkeze hizalı */}
                    <div className="flex flex-wrap justify-center gap-12 mt-8">
                        {members.map((member) => (
                        <div key={member.id} className="group flex flex-col items-center transform transition duration-300 hover:-translate-y-2">
                            
                            {/* Fotoğraf Çerçevesi (Gümüş Tema) */}
                            <div className="relative w-56 h-72 p-1.5 rounded-lg bg-gradient-to-br from-slate-300 via-slate-400 to-slate-600 shadow-[0_0_25px_rgba(148,163,184,0.15)] group-hover:shadow-[0_0_40px_rgba(148,163,184,0.35)] transition-shadow duration-300">
                            <div className="w-full h-full bg-slate-800 rounded overflow-hidden border-2 border-slate-900 relative">
                                <img 
                                src={member.image} 
                                alt={member.name} 
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                                />
                                {/* İnce Parlama Efekti (Overlay) */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60"></div>
                            </div>
                            </div>

                            {/* İsim ve Ünvan */}
                            <div className="text-center mt-5">
                            <h3 className="text-2xl font-bold text-slate-100 group-hover:text-cyan-100 transition-colors drop-shadow-sm">
                                {member.name}
                            </h3>
                            <p className="text-slate-400 text-sm mt-1 font-medium uppercase tracking-wider group-hover:text-slate-300 transition-colors">
                                {member.title}
                            </p>
                            
                            {/* Alt Çizgi Animasyonu */}
                            <div className="w-0 group-hover:w-12 h-0.5 bg-gradient-to-r from-slate-500 to-cyan-400 mx-auto mt-3 transition-all duration-300"></div>
                            </div>
                        </div>
                        ))}
                    </div>

                    {members.length === 0 && (
                        <div className="text-center text-slate-500 py-10">
                            Henüz denetim kurulu üyesi eklenmemiş.
                        </div>
                    )}
                </>
            )}

        </div>
      </main>

      <Footer />
    </div>
  );
}