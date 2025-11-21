"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar'; 
import Footer from '../../components/Footer'; 
import { FileText, Download, Eye, Loader2 } from 'lucide-react';

// Firebase imports
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, appId } from '@/lib/firebase';

// Tip Tanımları
interface DriveLinks {
  view: string;
  download: string;
}

interface Document {
  id: number;
  title: string;
  category: "Sözleşme" | "Kanun";
  date: string;
  size: string;
  fileUrl: string;
}

interface PageData {
  documents: Document[];
}

// Google Drive Link Yardımcısı
const getDriveLinks = (url: string): DriveLinks => {
  if (!url || url === "#") return { view: "#", download: "#" };
  // Basit bir kontrol: Eğer drive linki ise dönüştürmeyi dene, değilse olduğu gibi bırak
  if (url.includes('drive.google.com')) {
      const idMatch = url.match(/\/d\/(.*?)\//);
      const fileId: string | null = idMatch ? idMatch[1] : null;

      if (fileId) {
        return {
          view: url, 
          download: `https://drive.google.com/uc?export=download&id=${fileId}` 
        };
      }
  }
  return { view: url, download: url };
};

// Varsayılan Veriler (İlk yükleme veya veri yoksa)
const defaultDocuments: Document[] = [
  {
    id: 1,
    title: "Bölge Birliği Ana Sözleşmesi",
    category: "Sözleşme",
    date: "TESKOMB",
    size: "314 KB",
    fileUrl: "https://drive.google.com/file/d/1Nez2otdKFvxoX71Zta3pYL27rdGg8SDp/view?usp=sharing"
  },
  {
    id: 2,
    title: "Kooperatif Ana Sözleşmesi",
    category: "Sözleşme",
    date: "TESKOMB & Kooperatifçilik Genel Müdürlüğü",
    size: "600 KB",
    fileUrl: "https://drive.google.com/file/d/1hGMWSw0Wk0kWTqnl2Yqs57U7QHfQwxPd/view?usp=sharing"
  },
  {
    id: 3,
    title: "Esnaf ve Sanatkarlar Kanunu",
    category: "Kanun",
    date: "Resmi Gazete",
    size: "251 KB",
    fileUrl: "https://drive.google.com/file/d/1QyzDIIdpzlLPLFsoEX3HqLO_nlGuLH7N/view?usp=sharing"
  },
  {
    id: 4,
    title: "Bilgi Edinme Kanunu",
    category: "Kanun",
    date: "Resmi Gazete",
    size: "335 KB",
    fileUrl: "https://drive.google.com/file/d/1YBFVvrKoFs5p9vhRhY45_zx07LLaSfAx/view?usp=sharing"
  }
];

export default function KanunVeYonetmelikler() {
  const [documents, setDocuments] = useState<Document[]>(defaultDocuments);
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

    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'page-content', 'laws-regulations');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as PageData;
        if (data.documents && data.documents.length > 0) {
            setDocuments(data.documents);
        }
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
      
      {/* Ana Kapsayıcı: Arka plan efektleri */}
      <main className="flex-grow relative overflow-hidden">
        
        {/* --- GLOBAL ARKA PLAN EFEKTLERİ --- */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen"></div>
            <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[100px] mix-blend-screen"></div>
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/10 blur-[90px] rounded-full mix-blend-screen"></div>
            <div className="absolute top-[60%] right-[-15%] w-[800px] h-[800px] bg-slate-600/15 rounded-full blur-[140px] mix-blend-screen"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-900/15 rounded-full blur-[150px] mix-blend-screen"></div>
        </div>

        {/* --- BAŞLIK BÖLÜMÜ --- */}
        <div className="relative z-10 pt-28 pb-12 lg:pt-40 lg:pb-16 text-center">
            <div className="container mx-auto px-4">
                <div className="inline-flex items-center justify-center space-x-3 mb-4 opacity-90">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-indigo-400"></div>
                    <span className="text-indigo-400 font-bold tracking-[0.25em] uppercase text-xs">YASAL DAYANAKLAR</span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-indigo-400"></div>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight drop-shadow-2xl">
                  Mevzuat ve <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Yönetmelikler</span>
                </h1>
                
                <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
                  Kooperatifimizin işleyişini düzenleyen temel kanunlar, ana sözleşmeler ve yasal prosedürlere buradan ulaşabilirsiniz.
                </p>
                
                <div className="mt-8 w-full max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
            </div>
        </div>

        {/* --- DOKÜMAN LİSTESİ --- */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            
            {loading ? (
               <div className="flex justify-center py-20">
                  <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
               </div>
            ) : (
                // ⭐️ DEĞİŞİKLİK: Grid yerine Flex ve justify-center kullanıldı
                <div className="flex flex-wrap justify-center gap-8">
                    {documents.map((doc) => {
                        const links: DriveLinks = getDriveLinks(doc.fileUrl); 
                        
                        return (
                        // ⭐️ DEĞİŞİKLİK: Genişlik ayarı eklendi (w-full md:w-[calc(50%-1rem)])
                        <div key={doc.id} className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-6 hover:bg-slate-800/60 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-900/10 flex flex-col sm:flex-row items-start gap-6 w-full md:w-[calc(50%-1rem)]">
                            
                            {/* İkon Alanı */}
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 bg-slate-700/50 rounded-xl flex items-center justify-center border border-slate-600 group-hover:border-purple-500/30 group-hover:bg-purple-500/10 transition-colors duration-300">
                                    <FileText className="w-7 h-7 text-slate-400 group-hover:text-purple-400 transition-colors" />
                                </div>
                            </div>

                            {/* İçerik Alanı */}
                            <div className="flex-grow w-full">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                                            doc.category === 'Kanun' 
                                            ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' 
                                            : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                                        }`}>
                                            {doc.category}
                                        </span>
                                        <h3 className="text-lg font-bold text-slate-100 mt-3 group-hover:text-white transition-colors">
                                            {doc.title}
                                        </h3>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 font-medium uppercase tracking-wide">
                                    <span>{doc.size}</span>
                                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                    <span>{doc.date}</span>
                                </div>

                                {/* Aksiyon Butonları */}
                                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-700/50">
                                    <a 
                                    href={links.view} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 flex-1 bg-slate-700/50 hover:bg-slate-700 text-slate-200 hover:text-white py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer no-underline border border-transparent hover:border-slate-500"
                                    >
                                        <Eye size={16} />
                                        İncele
                                    </a>
                                    <a 
                                    href={links.download}
                                    className="flex items-center justify-center gap-2 flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-900/20 hover:shadow-indigo-600/30 cursor-pointer no-underline"
                                    >
                                        <Download size={16} />
                                        İndir
                                    </a>
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            )}

            {/* Alt Bilgi Notu */}
            <div className="mt-16 p-6 bg-slate-800/30 border border-slate-800 rounded-xl text-center backdrop-blur-md">
                <p className="text-slate-500 text-sm">
                    Listelenen dokümanlar PDF formatındadır. Görüntülemek için cihazınızda PDF okuyucu yüklü olmalıdır.
                </p>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}