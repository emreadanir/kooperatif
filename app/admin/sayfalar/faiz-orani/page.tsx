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
  Save, ArrowLeft, Loader2, Percent, TrendingDown, Calendar, Info, Trash2, Plus, GripVertical
} from 'lucide-react';
import Link from 'next/link';

// Firestore Veri Tipi
interface ListData {
  label: string;
  value: string;
}

interface PageData {
  annualRate: string; // Yıllık Faiz Oranı
  description: string; // Faiz altındaki kısa açıklama
  termOptions: ListData[]; // Vade Seçenekleri
  deductionRates: ListData[]; // Kesinti Oranları
  disclaimer: string; // Dipnot
}

export default function FaizOraniYonetimi() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [annualRate, setAnnualRate] = useState('25,00');
  const [description, setDescription] = useState('Halkbank kaynaklı kredilerde uygulanan güncel yıllık faiz oranıdır.');
  const [disclaimer, setDisclaimer] = useState('Belirtilen faiz oranları ve kesintiler, piyasa koşullarına ve Hazine ve Maliye Bakanlığı\'nın düzenlemelerine göre değişkenlik gösterebilir. Güncel oranlar için lütfen kooperatifimizle iletişime geçiniz.');
  
  const [termOptions, setTermOptions] = useState<ListData[]>([
    { label: 'İşletme Kredisi', value: '60 Aya Kadar' },
    { label: 'Yatırım Kredisi', value: '120 Aya Kadar' }
  ]);

  const [deductionRates, setDeductionRates] = useState<ListData[]>([
    { label: 'Bloke Sermaye', value: '%1.5' },
    { label: 'Masraf Karşılığı', value: '%1.25' }
  ]);

  // Sürükle-Bırak State'leri
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

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
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'page-content', 'interest-rates');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as PageData;
          setAnnualRate(data.annualRate || '25,00');
          setDescription(data.description || '');
          setDisclaimer(data.disclaimer || '');
          setTermOptions(data.termOptions || []);
          setDeductionRates(data.deductionRates || []);
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
      const dataToSave: PageData = {
        annualRate,
        description,
        termOptions: termOptions.filter(i => i.label !== ''),
        deductionRates: deductionRates.filter(i => i.label !== ''),
        disclaimer
      };

      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'page-content', 'interest-rates'), dataToSave, { merge: true });
      
      alert("Sayfa içeriği başarıyla güncellendi!");
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- GENEL SÜRÜKLE-BIRAK FONKSİYONLARI ---
  const handleDragStart = (index: number, section: string) => {
    setDraggedIndex(index);
    setActiveSection(section);
  };

  const handleDragEnter = (index: number, section: string) => {
    if (draggedIndex === null || draggedIndex === index || activeSection !== section) return;

    if (section === 'termOptions') {
        const newItems = [...termOptions];
        const draggedItem = newItems[draggedIndex];
        newItems.splice(draggedIndex, 1);
        newItems.splice(index, 0, draggedItem);
        setTermOptions(newItems);
    } else if (section === 'deductionRates') {
        const newItems = [...deductionRates];
        const draggedItem = newItems[draggedIndex];
        newItems.splice(draggedIndex, 1);
        newItems.splice(index, 0, draggedItem);
        setDeductionRates(newItems);
    }

    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setActiveSection(null);
  };

  // --- Yardımcı Fonksiyonlar ---
  const handleAddItem = (setter: React.Dispatch<React.SetStateAction<ListData[]>>) => {
    setter(prev => [...prev, { label: '', value: '' }]);
  };

  const handleRemoveItem = (setter: React.Dispatch<React.SetStateAction<ListData[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (setter: React.Dispatch<React.SetStateAction<ListData[]>>, index: number, field: keyof ListData, value: string) => {
    setter(prev => {
      const newList = [...prev];
      newList[index][field] = value;
      return newList;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 p-6 md:p-12">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Percent className="text-emerald-500" />
            Faiz ve Kesinti Oranları
          </h1>
          <p className="text-slate-400 text-sm mt-1">Faiz oranlarını, vade seçeneklerini ve kesinti bilgilerini buradan yönetebilirsiniz.</p>
        </div>
        <Link href="/admin/sayfalar" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-slate-700">
            <ArrowLeft size={16} />
            Geri Dön
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
        
        {/* 1. BÖLÜM: ANA FAİZ ORANI */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                <TrendingDown className="text-emerald-400" size={24} />
                <h3 className="text-xl font-bold text-white">Yıllık Faiz Oranı</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-400">Faiz Oranı (%)</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            className="w-full bg-slate-900/50 border border-slate-600 rounded-xl pl-4 pr-4 py-3 text-2xl font-bold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            placeholder="25,00"
                            value={annualRate}
                            onChange={(e) => setAnnualRate(e.target.value)}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Görselde büyük puntolarla yazılacak alan.</p>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-400">Kısa Açıklama</label>
                    <textarea 
                        rows={3}
                        className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                        placeholder="Oranın altındaki açıklama metni..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            
            {/* 2. BÖLÜM: VADE SEÇENEKLERİ (Sürükle-Bırak) */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-4">
                    <div className="flex items-center gap-3">
                        <Calendar className="text-blue-400" size={24} />
                        <h3 className="text-xl font-bold text-white">Vade Seçenekleri</h3>
                    </div>
                </div>
                
                <div className="space-y-3">
                    {termOptions.map((item, index) => (
                        <div 
                            key={index} 
                            className={`flex gap-2 items-start bg-slate-900/30 p-3 rounded-xl border border-slate-700/50 group transition-all ${draggedIndex === index && activeSection === 'termOptions' ? 'opacity-50' : 'opacity-100'}`}
                            draggable
                            onDragStart={() => handleDragStart(index, 'termOptions')}
                            onDragEnter={() => handleDragEnter(index, 'termOptions')}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="text-slate-600 cursor-grab active:cursor-grabbing p-1 mt-1">
                                <GripVertical size={18} />
                            </div>
                            <div className="flex-1 space-y-1">
                                <input 
                                    type="text" 
                                    placeholder="Başlık (Örn: İşletme Kredisi)"
                                    className="w-full bg-transparent border-b border-slate-700 px-1 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                                    value={item.label}
                                    onChange={(e) => handleUpdateItem(setTermOptions, index, 'label', e.target.value)}
                                />
                                <input 
                                    type="text" 
                                    placeholder="Değer (Örn: 60 Ay)"
                                    className="w-full bg-transparent px-1 py-1 text-sm font-bold text-white focus:outline-none"
                                    value={item.value}
                                    onChange={(e) => handleUpdateItem(setTermOptions, index, 'value', e.target.value)}
                                />
                            </div>
                            <button 
                                type="button"
                                onClick={() => handleRemoveItem(setTermOptions, index)}
                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    <button 
                        type="button"
                        onClick={() => handleAddItem(setTermOptions)}
                        className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 px-3 py-2 rounded-lg hover:bg-blue-500/10 transition-colors w-fit mt-2"
                    >
                        <Plus size={14} /> Seçenek Ekle
                    </button>
                </div>
            </div>

            {/* 3. BÖLÜM: KESİNTİ ORANLARI (Sürükle-Bırak) */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-4">
                    <div className="flex items-center gap-3">
                        <Percent className="text-emerald-400" size={24} />
                        <h3 className="text-xl font-bold text-white">Kesinti Oranları</h3>
                    </div>
                </div>
                
                <div className="space-y-3">
                    {deductionRates.map((item, index) => (
                        <div 
                            key={index} 
                            className={`flex gap-2 items-start bg-slate-900/30 p-3 rounded-xl border border-slate-700/50 group transition-all ${draggedIndex === index && activeSection === 'deductionRates' ? 'opacity-50' : 'opacity-100'}`}
                            draggable
                            onDragStart={() => handleDragStart(index, 'deductionRates')}
                            onDragEnter={() => handleDragEnter(index, 'deductionRates')}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="text-slate-600 cursor-grab active:cursor-grabbing p-1 mt-1">
                                <GripVertical size={18} />
                            </div>
                            <div className="flex-1 space-y-1">
                                <input 
                                    type="text" 
                                    placeholder="Başlık (Örn: Bloke Sermaye)"
                                    className="w-full bg-transparent border-b border-slate-700 px-1 py-1 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                                    value={item.label}
                                    onChange={(e) => handleUpdateItem(setDeductionRates, index, 'label', e.target.value)}
                                />
                                <input 
                                    type="text" 
                                    placeholder="Değer (Örn: %1.5)"
                                    className="w-full bg-transparent px-1 py-1 text-sm font-bold text-white focus:outline-none"
                                    value={item.value}
                                    onChange={(e) => handleUpdateItem(setDeductionRates, index, 'value', e.target.value)}
                                />
                            </div>
                            <button 
                                type="button"
                                onClick={() => handleRemoveItem(setDeductionRates, index)}
                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    <button 
                        type="button"
                        onClick={() => handleAddItem(setDeductionRates)}
                        className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 px-3 py-2 rounded-lg hover:bg-emerald-500/10 transition-colors w-fit mt-2"
                    >
                        <Plus size={14} /> Kesinti Ekle
                    </button>
                </div>
            </div>

        </div>

        {/* 4. BÖLÜM: DİPNOT / UYARI */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-4">
                <Info className="text-indigo-400" size={24} />
                <h3 className="text-xl font-bold text-white">Dipnot / Yasal Uyarı</h3>
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-400">Bilgilendirme Metni</label>
                <textarea 
                    rows={3}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                    placeholder="Sayfanın en altındaki uyarı metni..."
                    value={disclaimer}
                    onChange={(e) => setDisclaimer(e.target.value)}
                ></textarea>
            </div>
        </div>

        {/* KAYDET BUTONU */}
        <div className="sticky bottom-6 flex justify-end">
            <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-emerald-900/30 transition-all transform hover:scale-105 flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Değişiklikleri Kaydet
            </button>
        </div>

      </form>
    </div>
  );
}