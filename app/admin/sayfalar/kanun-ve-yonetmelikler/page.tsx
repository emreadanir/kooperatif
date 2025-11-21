"use client";

import React, { useState, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';
import { auth, db, appId } from '@/lib/firebase';
import { 
  Save, ArrowLeft, Loader2, FileText, Plus, Trash2, GripVertical, Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';

// Firestore Veri Tipi
interface Document {
  id: number; // Sıralama ve key için client-side id
  title: string;
  category: "Sözleşme" | "Kanun";
  date: string;
  size: string;
  fileUrl: string;
}

interface PageData {
  documents: Document[];
}

export default function KanunVeYonetmeliklerYonetimi() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [documents, setDocuments] = useState<Document[]>([]);

  // Sürükle-Bırak State'leri
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else signInAnonymously(auth).catch((err) => console.error("Auth Error:", err));
    });
    return () => unsub();
  }, []);

  // Data Fetching
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'page-content', 'laws-regulations');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as PageData;
          setDocuments(data.documents || []);
        }
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Boş başlığı olanları temizle
      const validDocuments = documents.filter(d => d.title.trim() !== '');

      const dataToSave: PageData = {
        documents: validDocuments
      };

      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'page-content', 'laws-regulations'), dataToSave, { merge: true });
      
      alert("Sayfa içeriği başarıyla güncellendi!");
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Yardımcı Fonksiyonlar ---
  const addDocument = () => {
    // Yeni eklenenler için rastgele ID (sadece UI key'i için)
    const newId = documents.length > 0 ? Math.max(...documents.map(d => d.id)) + 1 : 1;
    setDocuments([...documents, { 
      id: newId, 
      title: '', 
      category: 'Sözleşme', 
      date: 'Resmi Gazete', 
      size: '300 KB', 
      fileUrl: '' 
    }]);
  };

  const removeDocument = (index: number) => {
    const newDocs = [...documents];
    newDocs.splice(index, 1);
    setDocuments(newDocs);
  };

  const updateDocument = (index: number, field: keyof Document, value: any) => {
    const newDocs = [...documents];
    newDocs[index] = { ...newDocs[index], [field]: value };
    setDocuments(newDocs);
  };

  // Sürükle-Bırak
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newDocs = [...documents];
    const draggedItem = newDocs[draggedIndex];
    newDocs.splice(draggedIndex, 1);
    newDocs.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    setDocuments(newDocs);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 p-6 md:p-12">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="text-purple-500" />
            Kanun ve Yönetmelikler
          </h1>
          <p className="text-slate-400 text-sm mt-1">Sitedeki mevzuat dokümanlarını buradan düzenleyebilirsiniz.</p>
        </div>
        <Link href="/admin/sayfalar" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-slate-700">
            <ArrowLeft size={16} />
            Geri Dön
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
        
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                <FileText className="text-purple-400" size={24} />
                <h3 className="text-xl font-bold text-white">Doküman Listesi</h3>
            </div>
            
            <div className="space-y-4">
                {documents.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm italic">
                        Henüz doküman eklenmemiş.
                    </div>
                )}

                {documents.map((item, index) => (
                    <div 
                        key={item.id || index} 
                        className={`flex flex-col md:flex-row gap-4 items-start bg-slate-900/30 p-5 rounded-xl border border-slate-700/50 relative group transition-all ${draggedIndex === index ? 'opacity-50 scale-[0.99] border-purple-500/30' : 'opacity-100'}`}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragEnter={() => handleDragEnter(index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        {/* Tutamaç */}
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-600 cursor-grab active:cursor-grabbing hover:text-slate-400 p-1 hidden md:block">
                            <GripVertical size={20} />
                        </div>

                        <div className="flex-1 w-full md:pl-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
                            
                            {/* Başlık */}
                            <div className="lg:col-span-4">
                                <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Doküman Başlığı</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                                    placeholder="Örn: Kooperatif Ana Sözleşmesi"
                                    value={item.title}
                                    onChange={(e) => updateDocument(index, 'title', e.target.value)}
                                />
                            </div>

                            {/* Kategori */}
                            <div className="lg:col-span-2">
                                <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Kategori</label>
                                <select 
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 appearance-none"
                                    value={item.category}
                                    onChange={(e) => updateDocument(index, 'category', e.target.value)}
                                >
                                    <option value="Sözleşme">Sözleşme</option>
                                    <option value="Kanun">Kanun</option>
                                </select>
                            </div>

                            {/* Kaynak/Tarih */}
                            <div className="lg:col-span-2">
                                <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Kaynak / Kurum</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                                    placeholder="Örn: Resmi Gazete"
                                    value={item.date}
                                    onChange={(e) => updateDocument(index, 'date', e.target.value)}
                                />
                            </div>

                            {/* Boyut */}
                            <div className="lg:col-span-1">
                                <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Boyut</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                                    placeholder="500 KB"
                                    value={item.size}
                                    onChange={(e) => updateDocument(index, 'size', e.target.value)}
                                />
                            </div>

                            {/* Link */}
                            <div className="lg:col-span-3">
                                <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block flex items-center gap-1"><LinkIcon size={10}/> Dosya Linki (Google Drive/PDF)</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 font-mono text-xs"
                                    placeholder="https://..."
                                    value={item.fileUrl}
                                    onChange={(e) => updateDocument(index, 'fileUrl', e.target.value)}
                                />
                            </div>

                        </div>

                        <div className="flex flex-col justify-center mt-2 md:mt-0">
                            <button 
                                type="button"
                                onClick={() => removeDocument(index)}
                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Sil"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                
                <button 
                    type="button"
                    onClick={addDocument}
                    className="flex items-center gap-2 text-sm font-bold text-purple-400 hover:text-purple-300 px-4 py-3 rounded-xl border border-dashed border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/10 transition-all w-full justify-center"
                >
                    <Plus size={18} /> Yeni Doküman Ekle
                </button>
            </div>
        </div>

        {/* KAYDET BUTONU */}
        <div className="sticky bottom-6 flex justify-end">
            <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-purple-900/30 transition-all transform hover:scale-105 flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Değişiklikleri Kaydet
            </button>
        </div>

      </form>
    </div>
  );
}