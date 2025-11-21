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
  Save, ArrowLeft, Loader2, ShieldCheck, FileText, UserCheck, Plus, Trash2, GripVertical
} from 'lucide-react';
import Link from 'next/link';

// Firestore Veri Tipi
interface CollateralItem {
  title: string;
  desc: string;
}

interface PageData {
  conditions: string[]; // Kimler Kullanabilir
  conditionsActive: boolean;
  collaterals: CollateralItem[]; // Teminatlar
  collateralsActive: boolean;
  commonDocs: string[]; // Ortak Belgeler
  financialDocs: string[]; // Mali Belgeler
  documentsActive: boolean;
}

export default function KrediKullanimSartlariYonetimi() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [conditions, setConditions] = useState<string[]>(['']);
  const [conditionsActive, setConditionsActive] = useState(true);

  const [collaterals, setCollaterals] = useState<CollateralItem[]>([{ title: '', desc: '' }]);
  const [collateralsActive, setCollateralsActive] = useState(true);

  const [commonDocs, setCommonDocs] = useState<string[]>(['']);
  const [financialDocs, setFinancialDocs] = useState<string[]>(['']);
  const [documentsActive, setDocumentsActive] = useState(true);

  // Sürükle-Bırak State'leri
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else signInAnonymously(auth).catch((err) => console.error("Auth Error:", err));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'page-content', 'credit-conditions');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as PageData;
          
          setConditions(data.conditions && data.conditions.length > 0 ? data.conditions : ['']);
          setConditionsActive(data.conditionsActive !== undefined ? data.conditionsActive : true);

          setCollaterals(data.collaterals || []);
          setCollateralsActive(data.collateralsActive !== undefined ? data.collateralsActive : true);

          setCommonDocs(data.commonDocs && data.commonDocs.length > 0 ? data.commonDocs : ['']);
          setFinancialDocs(data.financialDocs && data.financialDocs.length > 0 ? data.financialDocs : ['']);
          setDocumentsActive(data.documentsActive !== undefined ? data.documentsActive : true);
        }
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const validConditions = conditions.map(c => c.trim()).filter(c => c !== '');
      const validCollaterals = collaterals.filter(c => c.title.trim() !== '');
      const validCommonDocs = commonDocs.map(s => s.trim()).filter(s => s !== '');
      const validFinancialDocs = financialDocs.map(s => s.trim()).filter(s => s !== '');

      const dataToSave: PageData = {
        conditions: validConditions,
        conditionsActive,
        collaterals: validCollaterals,
        collateralsActive,
        commonDocs: validCommonDocs,
        financialDocs: validFinancialDocs,
        documentsActive
      };

      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'page-content', 'credit-conditions'), dataToSave, { merge: true });
      
      alert("Sayfa içeriği başarıyla güncellendi!");
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragStart = (index: number, section: string) => {
    setDraggedIndex(index);
    setActiveSection(section);
  };

  const handleDragEnter = (index: number, section: string) => {
    if (draggedIndex === null || draggedIndex === index || activeSection !== section) return;

    if (section === 'conditions') {
        const newItems = [...conditions];
        const draggedItem = newItems[draggedIndex];
        newItems.splice(draggedIndex, 1);
        newItems.splice(index, 0, draggedItem);
        setConditions(newItems);
    } else if (section === 'collaterals') {
        const newItems = [...collaterals];
        const draggedItem = newItems[draggedIndex];
        newItems.splice(draggedIndex, 1);
        newItems.splice(index, 0, draggedItem);
        setCollaterals(newItems);
    } else if (section === 'commonDocs') {
        const newItems = [...commonDocs];
        const draggedItem = newItems[draggedIndex];
        newItems.splice(draggedIndex, 1);
        newItems.splice(index, 0, draggedItem);
        setCommonDocs(newItems);
    } else if (section === 'financialDocs') {
        const newItems = [...financialDocs];
        const draggedItem = newItems[draggedIndex];
        newItems.splice(draggedIndex, 1);
        newItems.splice(index, 0, draggedItem);
        setFinancialDocs(newItems);
    }

    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setActiveSection(null);
  };

  // Yardımcı Fonksiyonlar
  const addCondition = () => setConditions([...conditions, '']);
  const removeCondition = (index: number) => setConditions(conditions.filter((_, i) => i !== index));
  const updateCondition = (index: number, value: string) => {
    const newArr = [...conditions];
    newArr[index] = value;
    setConditions(newArr);
  };

  const addCollateral = () => setCollaterals([...collaterals, { title: '', desc: '' }]);
  const removeCollateral = (index: number) => setCollaterals(collaterals.filter((_, i) => i !== index));
  const updateCollateral = (index: number, field: keyof CollateralItem, value: string) => {
    const newArr = [...collaterals];
    newArr[index][field] = value;
    setCollaterals(newArr);
  };

  const addCommonDoc = () => setCommonDocs([...commonDocs, '']);
  const removeCommonDoc = (index: number) => setCommonDocs(commonDocs.filter((_, i) => i !== index));
  const updateCommonDoc = (index: number, value: string) => {
    const newArr = [...commonDocs];
    newArr[index] = value;
    setCommonDocs(newArr);
  };

  const addFinancialDoc = () => setFinancialDocs([...financialDocs, '']);
  const removeFinancialDoc = (index: number) => setFinancialDocs(financialDocs.filter((_, i) => i !== index));
  const updateFinancialDoc = (index: number, value: string) => {
    const newArr = [...financialDocs];
    newArr[index] = value;
    setFinancialDocs(newArr);
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
      
      <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="text-indigo-500" />
            Kredi Kullanım Şartları
          </h1>
          <p className="text-slate-400 text-sm mt-1">Sitedeki "Kredi Kullanım Şartları" sayfasının içeriğini buradan düzenleyebilirsiniz.</p>
        </div>
        <Link href="/admin/sayfalar" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-slate-700">
            <ArrowLeft size={16} />
            Geri Dön
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
        
        {/* 1. BÖLÜM: KİMLER KULLANABİLİR */}
        <div className={`bg-slate-800/40 border rounded-2xl p-6 transition-all duration-300 ${conditionsActive ? 'border-slate-700/50' : 'border-slate-700/30 opacity-60 grayscale-[0.5]'}`}>
            <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-4">
                <div className="flex items-center gap-3">
                    <UserCheck className={conditionsActive ? "text-emerald-400" : "text-slate-500"} size={24} />
                    <h3 className="text-xl font-bold text-white">Kimler Kredi Kullanabilir?</h3>
                </div>
                
                {/* iOS Style Toggle Switch */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setConditionsActive(!conditionsActive)}>
                    <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${conditionsActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {conditionsActive ? 'Aktif' : 'Pasif'}
                    </span>
                    <div className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${conditionsActive ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                        <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${conditionsActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                </div>
            </div>
            
            {conditionsActive && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                {conditions.map((item, index) => (
                    <div 
                        key={index} 
                        className={`flex items-center gap-3 group transition-all ${draggedIndex === index && activeSection === 'conditions' ? 'opacity-50' : 'opacity-100'}`}
                        draggable
                        onDragStart={() => handleDragStart(index, 'conditions')}
                        onDragEnter={() => handleDragEnter(index, 'conditions')}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <div className="text-slate-600 cursor-grab active:cursor-grabbing hover:text-slate-400 p-1">
                            <GripVertical size={20} />
                        </div>
                        <input 
                            type="text" 
                            className="flex-1 w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
                            placeholder={`Madde ${index + 1}`}
                            value={item}
                            onChange={(e) => updateCondition(index, e.target.value)}
                        />
                        <button 
                            type="button"
                            onClick={() => removeCondition(index)}
                            className="p-3 bg-slate-800 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-xl transition-colors border border-slate-700 hover:border-red-500/30"
                            title="Sil"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                <button 
                    type="button"
                    onClick={addCondition}
                    className="flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 px-4 py-2 rounded-lg hover:bg-emerald-500/10 transition-colors w-fit mt-2"
                >
                    <Plus size={16} /> Yeni Madde Ekle
                </button>
            </div>
            )}
        </div>

        {/* 2. BÖLÜM: TEMİNAT KOŞULLARI */}
        <div className={`bg-slate-800/40 border rounded-2xl p-6 transition-all duration-300 ${collateralsActive ? 'border-slate-700/50' : 'border-slate-700/30 opacity-60 grayscale-[0.5]'}`}>
            <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-4">
                <div className="flex items-center gap-3">
                    <ShieldCheck className={collateralsActive ? "text-indigo-400" : "text-slate-500"} size={24} />
                    <h3 className="text-xl font-bold text-white">Teminat Koşulları</h3>
                </div>
                
                {/* iOS Style Toggle Switch - Yeşil Renk Güncellemesi Yapıldı */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCollateralsActive(!collateralsActive)}>
                    <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${collateralsActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {collateralsActive ? 'Aktif' : 'Pasif'}
                    </span>
                    <div className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${collateralsActive ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                        <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${collateralsActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                </div>
            </div>
            
            {collateralsActive && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                {collaterals.map((item, index) => (
                    <div 
                        key={index} 
                        className={`flex flex-col md:flex-row gap-3 items-center bg-slate-900/30 p-4 rounded-xl border border-slate-700/50 relative group transition-all ${draggedIndex === index && activeSection === 'collaterals' ? 'opacity-50' : 'opacity-100'}`}
                        draggable
                        onDragStart={() => handleDragStart(index, 'collaterals')}
                        onDragEnter={() => handleDragEnter(index, 'collaterals')}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <div className="text-slate-600 cursor-grab active:cursor-grabbing hover:text-slate-400 mr-1">
                            <GripVertical size={24} />
                        </div>

                        <div className="flex-1 w-full">
                            <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Teminat Başlığı</label>
                            <input 
                                type="text" 
                                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                                placeholder="Örn: Şahıs Kefaleti"
                                value={item.title}
                                onChange={(e) => updateCollateral(index, 'title', e.target.value)}
                            />
                        </div>
                        <div className="flex-[2] w-full">
                            <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Açıklama</label>
                            <input 
                                type="text" 
                                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                                placeholder="Örn: En az 2 esnaf kefil..."
                                value={item.desc}
                                onChange={(e) => updateCollateral(index, 'desc', e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col justify-end h-full mt-6 md:mt-0">
                            <button 
                                type="button"
                                onClick={() => removeCollateral(index)}
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
                    onClick={addCollateral}
                    className="flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 px-4 py-2 rounded-lg hover:bg-indigo-500/10 transition-colors w-fit"
                >
                    <Plus size={16} /> Yeni Teminat Ekle
                </button>
            </div>
            )}
        </div>

        {/* 3. BÖLÜM: GEREKLİ BELGELER */}
        <div className={`bg-slate-800/40 border rounded-2xl p-6 transition-all duration-300 ${documentsActive ? 'border-slate-700/50' : 'border-slate-700/30 opacity-60 grayscale-[0.5]'}`}>
            <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-4">
                <div className="flex items-center gap-3">
                    <FileText className={documentsActive ? "text-blue-400" : "text-slate-500"} size={24} />
                    <h3 className="text-xl font-bold text-white">Gerekli Belgeler</h3>
                </div>
                
                {/* iOS Style Toggle Switch */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setDocumentsActive(!documentsActive)}>
                    <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${documentsActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {documentsActive ? 'Aktif' : 'Pasif'}
                    </span>
                    <div className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${documentsActive ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                        <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${documentsActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                </div>
            </div>
            
            {documentsActive && (
            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-blue-300 border-b border-slate-700 pb-2 mb-3">Ortak Belgeler</label>
                    {commonDocs.map((item, index) => (
                        <div 
                            key={index} 
                            className={`flex items-center gap-2 group transition-all ${draggedIndex === index && activeSection === 'commonDocs' ? 'opacity-50' : 'opacity-100'}`}
                            draggable
                            onDragStart={() => handleDragStart(index, 'commonDocs')}
                            onDragEnter={() => handleDragEnter(index, 'commonDocs')}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="text-slate-600 cursor-grab active:cursor-grabbing p-1">
                                <GripVertical size={18} />
                            </div>
                            <input 
                                type="text" 
                                className="flex-1 w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                                placeholder="Belge adı..."
                                value={item}
                                onChange={(e) => updateCommonDoc(index, e.target.value)}
                            />
                            <button 
                                type="button"
                                onClick={() => removeCommonDoc(index)}
                                className="p-2 bg-slate-800 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                                title="Sil"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    <button 
                        type="button"
                        onClick={addCommonDoc}
                        className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 px-3 py-2 rounded-lg hover:bg-blue-500/10 transition-colors w-fit mt-2"
                    >
                        <Plus size={14} /> Belge Ekle
                    </button>
                </div>
                
                {/* MALİ BELGELER */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-blue-300 border-b border-slate-700 pb-2 mb-3">Mali Belgeler</label>
                    {financialDocs.map((item, index) => (
                        <div 
                            key={index} 
                            className={`flex items-center gap-2 group transition-all ${draggedIndex === index && activeSection === 'financialDocs' ? 'opacity-50' : 'opacity-100'}`}
                            draggable
                            onDragStart={() => handleDragStart(index, 'financialDocs')}
                            onDragEnter={() => handleDragEnter(index, 'financialDocs')}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="text-slate-600 cursor-grab active:cursor-grabbing p-1">
                                <GripVertical size={18} />
                            </div>
                            <input 
                                type="text" 
                                className="flex-1 w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                                placeholder="Belge adı..."
                                value={item}
                                onChange={(e) => updateFinancialDoc(index, e.target.value)}
                            />
                            <button 
                                type="button"
                                onClick={() => removeFinancialDoc(index)}
                                className="p-2 bg-slate-800 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                                title="Sil"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    <button 
                        type="button"
                        onClick={addFinancialDoc}
                        className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 px-3 py-2 rounded-lg hover:bg-blue-500/10 transition-colors w-fit mt-2"
                    >
                        <Plus size={14} /> Belge Ekle
                    </button>
                </div>

            </div>
            )}
        </div>

        <div className="sticky bottom-6 flex justify-end">
            <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-blue-900/30 transition-all transform hover:scale-105 flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Değişiklikleri Kaydet
            </button>
        </div>

      </form>
    </div>
  );
}