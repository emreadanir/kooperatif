"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar'; 
import Footer from '../../components/Footer'; 
import { MapPin, Phone, Mail, Loader2, Globe } from 'lucide-react';

// Firebase imports
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, appId } from '@/lib/firebase';

// Tip Tanımları
interface PhoneItem {
  number: string;
  note: string;
}

interface EmailItem {
  address: string;
  note: string;
}

interface ContactData {
  address: string;
  city: string;
  phones: PhoneItem[];
  emails: EmailItem[];
  mapEmbedUrl: string;
  // Geriye dönük uyumluluk
  phone?: string;
  phoneNote?: string;
  email?: string;
  emailNote?: string;
}

// Varsayılan Veriler
const defaultData: ContactData = {
  address: "Cumhuriyet Mah. Atatürk Cad. No:123",
  city: "Merkez / TÜRKİYE",
  phones: [{ number: "0 (212) 123 45 67", note: "Hafta içi 08:30 - 17:30" }],
  emails: [{ address: "bilgi@kooperatif.org.tr", note: "7/24 e-posta gönderebilirsiniz" }],
  mapEmbedUrl: ""
};

const Iletisim: React.FC = () => {
  const [contactData, setContactData] = useState<ContactData>(defaultData);
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

    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'page-content', 'contact-info');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as ContactData;
        
        const phones = data.phones && data.phones.length > 0 
            ? data.phones 
            : (data.phone ? [{ number: data.phone, note: data.phoneNote || '' }] : defaultData.phones);

        const emails = data.emails && data.emails.length > 0
            ? data.emails
            : (data.email ? [{ address: data.email, note: data.emailNote || '' }] : defaultData.emails);

        setContactData({
            ...data,
            phones,
            emails
        });
      }
      setLoading(false);
    }, (err) => {
      console.error("Data fetch error:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 flex flex-col">
      <Navbar />
      
      {/* Ana Kapsayıcı */}
      <main className="flex-grow relative overflow-hidden">
        
        {/* Arka Plan Efektleri */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen"></div>
            <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[100px] mix-blend-screen"></div>
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/10 blur-[90px] rounded-full mix-blend-screen"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-900/15 rounded-full blur-[150px] mix-blend-screen"></div>
        </div>

        {/* Başlık Bölümü */}
        <div className="relative z-10 pt-28 pb-12 lg:pt-40 lg:pb-16 text-center">
            <div className="container mx-auto px-4">
                <div className="inline-flex items-center justify-center space-x-3 mb-4 opacity-90">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-400"></div>
                    <span className="text-cyan-400 font-bold tracking-[0.25em] uppercase text-xs md:text-sm">BİRDEN FAZLA İLETİŞİM YOLU</span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-400"></div>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl">
                  Bize <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Ulaşın</span>
                </h1>
                
                <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
                  Sorularınız, görüşleriniz veya kredi başvurularınız için bizimle dilediğiniz zaman iletişime geçebilirsiniz.
                </p>
                
                <div className="mt-12 w-full max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
            </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            
            {loading ? (
               <div className="flex justify-center py-20">
                  <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
               </div>
            ) : (
            <>
                {/* İÇERİK IZGARASI (YENİ DÜZEN) */}
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    
                    {/* SOL SÜTUN: İLETİŞİM KANALLARI & ADRES */}
                    <div className="space-y-8">

                        {/* 1. Adres Kartı */}
                        <div className="group p-8 bg-slate-800/40 backdrop-blur-sm border border-slate-700/60 rounded-3xl hover:bg-slate-800/60 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                                    <MapPin className="w-7 h-7 text-cyan-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">Adres</h3>
                            </div>
                            <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                                {contactData.address}
                            </p>
                            <p className="text-cyan-400 font-bold mt-2 text-lg">{contactData.city}</p>
                        </div>
                        
                        {/* 2. Telefon Kartı (Çoklu) */}
                        <div className="group p-8 bg-slate-800/40 backdrop-blur-sm border border-slate-700/60 rounded-3xl hover:bg-slate-800/60 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                                    <Phone className="w-7 h-7 text-indigo-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">Telefon</h3>
                            </div>
                            
                            <div className="space-y-5">
                                {contactData.phones.map((phone, idx) => (
                                    <div key={idx} className="border-b border-slate-700/50 last:border-0 pb-4 last:pb-0">
                                        <p className="text-white text-lg font-semibold tracking-wide">
                                            {phone.number}
                                        </p>
                                        {phone.note && <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                            {phone.note}
                                        </p>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. E-posta Kartı (Çoklu) */}
                        <div className="group p-8 bg-slate-800/40 backdrop-blur-sm border border-slate-700/60 rounded-3xl hover:bg-slate-800/60 transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                    <Mail className="w-7 h-7 text-purple-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">E-Posta</h3>
                            </div>
                            
                            <div className="space-y-5">
                                {contactData.emails.map((email, idx) => (
                                    <div key={idx} className="border-b border-slate-700/50 last:border-0 pb-4 last:pb-0">
                                        <p className="text-white text-lg font-semibold tracking-wide break-all">
                                            {email.address}
                                        </p>
                                        {email.note && <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                            {email.note}
                                        </p>}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* SAĞ SÜTUN: HARİTA (Form Kaldırıldı) */}
                    <div className="space-y-8">
                        {/* Harita */}
                        {contactData.mapEmbedUrl && (
                            <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative h-[600px] bg-slate-900 group">
                                <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2 text-xs text-slate-300">
                                    <Globe size={14} className="text-emerald-400"/> Konumumuz
                                </div>
                                <iframe 
                                    src={contactData.mapEmbedUrl} 
                                    className="w-full h-full border-0 grayscale-[0.2] hover:grayscale-0 transition-all duration-700" 
                                    allowFullScreen 
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        )}
                    </div>

                </div>
            </>
            )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Iletisim;