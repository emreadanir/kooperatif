"use client";

import React, { useState, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { auth, db, appId } from '@/lib/firebase';
import { 
  Briefcase, Building2, Truck, Wallet, CreditCard, 
  Edit, Trash2, Plus, Loader2, ArrowLeft, Save, X, GripVertical, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

// Firestore Veri Tipi
interface CreditType {
  id: string;
  title: string;
  description: string;
  features: string[];
  iconName: string;
  color: 'amber' | 'indigo' | 'cyan';
  order: number;
}

// Kullanılabilir İkonlar
const ICON_OPTIONS = [
  { name: 'Briefcase', icon: Briefcase, label: 'Çanta' },
  { name: 'Building2', icon: Building2, label: 'Bina' },
  { name: 'Truck', icon: Truck, label: 'Kamyon' },
  { name: 'Wallet', icon: Wallet, label: 'Cüzdan' },
  { name: 'CreditCard', icon: CreditCard, label: 'Kart' },
];

// Renk Seçenekleri
const COLOR_OPTIONS = [
  { value: 'amber', label: 'Amber (Turuncu)', class: 'bg-amber-500' },
  { value: 'indigo', label: 'Indigo (Mor)', class: 'bg-indigo-500' },
  { value: 'cyan', label: 'Cyan (Mavi)', class: 'bg-cyan-500' },
];

export default function KrediCesitleriYonetimi() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<CreditType[]>([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // ⭐️ GÜNCELLEME: featuresText yerine features array state kullanıyoruz
  const [features, setFeatures] = useState<string[]>(['']); 
  const [iconName, setIconName] = useState('Briefcase');
  const [color, setColor] = useState<'amber' | 'indigo' | 'cyan'>('amber');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Sürükleme State (Ana Liste İçin)
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Sürükleme State (Özellikler Listesi İçin)
  const [draggedFeatureIndex, setDraggedFeatureIndex] = useState<number | null>(null);

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
    const q = query(
      collection(db, 'artifacts', appId, 'public', 'data', 'credit-types'),
      orderBy('order', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (isDragging) return;
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CreditType[];
      setCredits(data);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsubscribe();
  }, [user, isDragging]);

  // Form Reset
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFeatures(['']); // Array'i sıfırla
    setIconName('Briefcase');
    setColor('amber');
    setEditingId(null);
  };

  // Edit Mode
  const handleEditClick = (item: CreditType) => {
    setTitle(item.title);
    setDescription(item.description);
    // Mevcut özellikleri array olarak al, yoksa boş bir kutu göster
    setFeatures(item.features && item.features.length > 0 ? item.features : ['']);
    setIconName(item.iconName);
    setColor(item.color);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title) return;

    setIsSubmitting(true);
    try {
      // Array'deki boş maddeleri temizle
      const validFeatures = features.map(f => f.trim()).filter(f => f !== '');

      const docData = {
        title,
        description,
        features: validFeatures, // Temizlenmiş array'i gönder
        iconName,
        color,
        ...(editingId ? {} : { createdAt: serverTimestamp(), order: credits.length + 1 })
      };

      if (editingId) {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'credit-types', editingId), docData);
      } else {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'credit-types'), docData);
      }
      resetForm();
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Bu kredi türünü silmek istediğinize emin misiniz?")) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'credit-types', id));
      if (editingId === id) resetForm();
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  // --- ANA LİSTE İÇİN SÜRÜKLE-BIRAK ---
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
    setIsDragging(true);
  };
  const handleDragEnter = (index: number) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    const newItems = [...credits];
    const draggedItem = newItems[draggedItemIndex];
    newItems.splice(draggedItemIndex, 1);
    newItems.splice(index, 0, draggedItem);
    setDraggedItemIndex(index);
    setCredits(newItems);
  };
  const handleDragEnd = async () => {
    setIsDragging(false);
    setDraggedItemIndex(null);
    try {
      const batch = writeBatch(db);
      credits.forEach((item, index) => {
        const newOrder = index + 1;
        if (item.order !== newOrder) {
            const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'credit-types', item.id);
            batch.update(docRef, { order: newOrder });
        }
      });
      await batch.commit();
    } catch (error) {
      console.error("Sıralama hatası:", error);
    }
  };

  // --- ÖZELLİKLER İÇİN SÜRÜKLE-BIRAK VE YÖNETİM ---
  
  // Yeni özellik ekle
  const addFeature = () => {
    setFeatures([...features, '']);
  };

  // Özelliği sil
  const removeFeature = (index: number) => {
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    setFeatures(newFeatures);
  };

  // Özellik metnini güncelle
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  // Özellik sürükleme işlemleri
  const handleFeatureDragStart = (index: number) => {
    setDraggedFeatureIndex(index);
  };

  const handleFeatureDragEnter = (index: number) => {
    if (draggedFeatureIndex === null || draggedFeatureIndex === index) return;
    const newFeatures = [...features];
    const draggedItem = newFeatures[draggedFeatureIndex];
    newFeatures.splice(draggedFeatureIndex, 1);
    newFeatures.splice(index, 0, draggedItem);
    setDraggedFeatureIndex(index);
    setFeatures(newFeatures);
  };

  const handleFeatureDragEnd = () => {
    setDraggedFeatureIndex(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 p-6 md:p-12">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <CreditCard className="text-blue-500" />
            Kredi Çeşitleri Yönetimi
          </h1>
          <p className="text-slate-400 text-sm mt-1">Web sitesindeki kredi kartlarını buradan düzenleyebilirsiniz.</p>
        </div>
        <div className="flex gap-3">
            <Link href="/admin/sayfalar" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-slate-700">
                <ArrowLeft size={16} />
                Geri Dön
            </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">
        
        {/* --- SOL: FORM --- */}
        <div className="lg:col-span-5">
          <div className={`bg-slate-800/50 border rounded-2xl p-6 sticky top-6 transition-all duration-300 ${editingId ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'border-slate-700/50'}`}>
            
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold flex items-center gap-2 ${editingId ? 'text-blue-400' : 'text-white'}`}>
                {editingId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5 text-blue-400" />}
                {editingId ? 'Krediyi Düzenle' : 'Yeni Kredi Ekle'}
              </h3>
              {editingId && (
                <button onClick={resetForm} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded transition-colors">
                  <X size={12} /> Vazgeç
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Kredi Başlığı</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="Örn: İşletme Kredisi"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Kısa Açıklama</label>
                <textarea 
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm resize-none"
                  placeholder="Kart üzerinde görünecek açıklama..."
                  required
                ></textarea>
              </div>

              {/* ⭐️ ÖZELLİKLER BÖLÜMÜ (DRAG & DROP) */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Özellikler</label>
                <div className="space-y-2">
                    {features.map((feature, index) => (
                        <div 
                            key={index} 
                            className={`flex items-center gap-2 group transition-all ${draggedFeatureIndex === index ? 'opacity-50' : 'opacity-100'}`}
                            draggable
                            onDragStart={() => handleFeatureDragStart(index)}
                            onDragEnter={() => handleFeatureDragEnter(index)}
                            onDragEnd={handleFeatureDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="text-slate-600 cursor-grab active:cursor-grabbing hover:text-slate-400 p-1">
                                <GripVertical size={18} />
                            </div>
                            <input 
                                type="text" 
                                value={feature}
                                onChange={(e) => updateFeature(index, e.target.value)}
                                className="flex-1 bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                                placeholder="Özellik ekleyin..."
                            />
                            <button 
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="p-2 bg-slate-800 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-colors border border-slate-700 hover:border-red-500/30"
                                title="Sil"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    
                    <button 
                        type="button"
                        onClick={addFeature}
                        className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 px-3 py-2 rounded-lg hover:bg-blue-500/10 transition-colors w-fit mt-2"
                    >
                        <Plus size={14} /> Özellik Ekle
                    </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">İkon Seçimi</label>
                    <div className="grid grid-cols-3 gap-2">
                        {ICON_OPTIONS.map((opt) => (
                            <button
                                key={opt.name}
                                type="button"
                                onClick={() => setIconName(opt.name)}
                                className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all border ${iconName === opt.name ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}
                                title={opt.label}
                            >
                                <opt.icon size={20} />
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Renk Teması</label>
                    <div className="space-y-2">
                        {COLOR_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setColor(opt.value as any)}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs font-bold ${color === opt.value ? 'border-white/30 bg-slate-700 text-white' : 'border-transparent text-slate-400 hover:bg-slate-800'}`}
                            >
                                <div className={`w-4 h-4 rounded-full ${opt.class}`}></div>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg ${
                  editingId 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'
                }`}
              >
                {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : (editingId ? <><Save size={18}/> Güncelle</> : <><Plus size={18}/> Ekle</>)}
              </button>

            </form>
          </div>
        </div>

        {/* --- SAĞ: LİSTE --- */}
        <div className="lg:col-span-7">
          <div className="space-y-4">
            {credits.length === 0 ? (
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[300px]">
                <div className="bg-slate-800 p-4 rounded-full mb-4">
                    <CreditCard className="w-8 h-8 opacity-50" />
                </div>
                <p className="text-lg font-medium text-slate-400">Henüz kredi türü eklenmemiş.</p>
              </div>
            ) : (
              credits.map((item, index) => {
                // Dinamik İkon Bulma
                const IconComponent = ICON_OPTIONS.find(i => i.name === item.iconName)?.icon || Briefcase;
                
                return (
                <div 
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className={`bg-slate-800/40 border rounded-xl p-5 transition-all group relative flex gap-5 items-start select-none cursor-grab active:cursor-grabbing ${
                    editingId === item.id 
                    ? 'border-blue-500/50 ring-1 ring-blue-500/30 bg-slate-800/80' 
                    : 'border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-800/60'
                  } ${draggedItemIndex === index ? 'opacity-50' : 'opacity-100'}`}
                >
                  <div className="mt-2 text-slate-600 cursor-grab active:cursor-grabbing hover:text-slate-400">
                    <GripVertical size={20} />
                  </div>

                  {/* Renkli İkon Alanı */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/10 ${
                      item.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                      item.color === 'indigo' ? 'bg-indigo-500/20 text-indigo-400' :
                      'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    <IconComponent size={24} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-bold text-lg">{item.title}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider border ${
                            item.color === 'amber' ? 'border-amber-500/30 text-amber-500 bg-amber-500/10' :
                            item.color === 'indigo' ? 'border-indigo-500/30 text-indigo-500 bg-indigo-500/10' :
                            'border-cyan-500/30 text-cyan-500 bg-cyan-500/10'
                        }`}>{item.color}</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                    
                    {/* Özellikler Önizleme */}
                    <div className="flex flex-wrap gap-2">
                        {item.features.slice(0, 3).map((f, i) => (
                            <span key={i} className="text-[10px] bg-slate-900/50 text-slate-500 px-2 py-1 rounded border border-slate-700 flex items-center gap-1">
                                <CheckCircle2 size={10} /> {f}
                            </span>
                        ))}
                        {item.features.length > 3 && (
                            <span className="text-[10px] text-slate-600 px-1 py-1">+{item.features.length - 3}</span>
                        )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button 
                      onClick={() => handleEditClick(item)}
                      className={`p-2 rounded-lg transition-colors ${
                        editingId === item.id 
                        ? 'bg-blue-500 text-white' 
                        : 'text-slate-500 hover:text-blue-400 hover:bg-blue-500/10'
                      }`}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-slate-500 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )})
            )}
          </div>
        </div>

      </div>
    </div>
  );
}