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
import { Users, Trash2, Plus, Loader2, User, Briefcase, ArrowLeft, Edit, X, GripVertical, Layers } from 'lucide-react';
import Link from 'next/link';

// Personel Tipi
interface StaffMember {
  id: string;
  name: string;
  title: string;
  image: string;
  category: 'manager' | 'accounting' | 'officer' | 'service';
  order: number;
}

export default function PersonelKadrosuYonetimi() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<StaffMember[]>([]);
  
  // Form State'leri
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(''); 
  const [category, setCategory] = useState<'manager' | 'accounting' | 'officer' | 'service'>('officer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Düzenleme ve Sürükleme State'leri
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else signInAnonymously(auth).catch((err) => console.error("Giriş hatası:", err));
    });
    return () => unsub();
  }, []);

  // Veri Çekme (staff-members koleksiyonu)
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'artifacts', appId, 'public', 'data', 'staff-members'),
      orderBy('order', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (isDragging) return;

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StaffMember[];
      setMembers(data);
      setLoading(false);
    }, (error) => {
      console.error("Veri çekme hatası:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isDragging]);

  // Sürükle-Bırak
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
    setIsDragging(true);
  };

  const handleDragEnter = (index: number) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    const newItems = [...members];
    const draggedItem = newItems[draggedItemIndex];
    newItems.splice(draggedItemIndex, 1);
    newItems.splice(index, 0, draggedItem);
    setDraggedItemIndex(index);
    setMembers(newItems);
  };

  const handleDragEnd = async () => {
    setIsDragging(false);
    setDraggedItemIndex(null);

    try {
      const batch = writeBatch(db);
      members.forEach((item, index) => {
        const newOrder = index + 1;
        if (item.order !== newOrder) {
            const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'staff-members', item.id);
            batch.update(docRef, { order: newOrder });
        }
      });
      await batch.commit();
    } catch (error) {
      console.error("Sıralama hatası:", error);
      alert("Sıralama kaydedilemedi.");
    }
  };

  // Form İşlemleri
  const resetForm = () => {
    setName('');
    setTitle('');
    setImage('');
    setCategory('officer');
    setEditingId(null);
  };

  const handleEditClick = (item: StaffMember) => {
    setName(item.name);
    setTitle(item.title);
    setImage(item.image);
    setCategory(item.category);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name || !title) return;

    setIsSubmitting(true);
    try {
      // Kategoriye göre arka plan rengi seçimi (Avatar için)
      let bgColor = 'c0aede';
      if (category === 'manager') bgColor = 'b6e3f4'; // Mavi (Müdür)
      if (category === 'accounting') bgColor = 'ffdfbf'; // Turuncu (Muhasebe)
      
      const defaultImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&backgroundColor=${bgColor}`;
      
      const docData = {
        name,
        title,
        image: image || defaultImage,
        category,
        ...(editingId ? {} : { createdAt: serverTimestamp(), order: members.length + 1 })
      };

      if (editingId) {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'staff-members', editingId);
        await updateDoc(docRef, docData);
      } else {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'staff-members'), docData);
      }
      resetForm();
    } catch (error) {
      console.error("İşlem hatası:", error);
      alert("Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu personeli silmek istediğinize emin misiniz?")) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'staff-members', id));
      if (editingId === id) resetForm();
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  // Kategori Etiketi Yardımcısı
  const getCategoryLabel = (cat: string) => {
      switch(cat) {
          case 'manager': return 'Kooperatif Müdürü';
          case 'accounting': return 'Muhasebe';
          case 'officer': return 'Memur';
          case 'service': return 'Yardımcı Hizmetler';
          default: return cat;
      }
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
      
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="text-indigo-500" />
            Personel Kadrosu
          </h1>
          <p className="text-slate-400 text-sm mt-1">Personel kadrosunu buradan yönetebilirsiniz.</p>
        </div>
        <Link href="/admin" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-slate-700 shrink-0">
            <ArrowLeft size={16} />
            Panele Dön
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">
        
        {/* --- SOL: FORM ALANI --- */}
        <div className="lg:col-span-4">
          <div className={`bg-slate-800/50 border rounded-2xl p-6 sticky top-6 transition-all duration-300 ${editingId ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'border-slate-700/50'}`}>
            
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold flex items-center gap-2 ${editingId ? 'text-indigo-400' : 'text-white'}`}>
                {editingId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5 text-indigo-400" />}
                {editingId ? 'Personeli Düzenle' : 'Yeni Personel Ekle'}
              </h3>
              {editingId && (
                <button onClick={resetForm} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded transition-colors">
                  <X size={12} /> Vazgeç
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Ad Soyad</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                    placeholder="Örn: Ali Veli"
                    required
                    />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Ünvan / Görev</label>
                <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                    placeholder="Örn: Muhasebe Şefi"
                    required
                    />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Kategori / Birim</label>
                <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm appearance-none"
                    >
                        <option value="manager">Kooperatif Müdürü</option>
                        <option value="accounting">Muhasebe Servisi</option>
                        <option value="officer">Memurlar</option>
                        <option value="service">Yardımcı Hizmetler</option>
                    </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Fotoğraf URL (İsteğe Bağlı)</label>
                <input 
                  type="text" 
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                  placeholder="https://..."
                />
                <p className="text-[10px] text-slate-500 mt-1">Boş bırakılırsa otomatik bir avatar atanır.</p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg ${
                  editingId 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/20' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/20'
                }`}
              >
                {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : (editingId ? 'Güncelle' : 'Kaydet')}
              </button>

            </form>
          </div>
        </div>

        {/* --- SAĞ: LİSTE --- */}
        <div className="lg:col-span-8">
          <div className="space-y-3">
            {members.length === 0 ? (
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[300px]">
                <div className="bg-slate-800 p-4 rounded-full mb-4">
                    <Users className="w-8 h-8 opacity-50" />
                </div>
                <p className="text-lg font-medium text-slate-400">Henüz personel eklenmemiş.</p>
              </div>
            ) : (
              members.map((item, index) => (
                <div 
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className={`border rounded-xl p-4 transition-all group relative flex gap-4 items-center select-none cursor-grab active:cursor-grabbing ${
                    editingId === item.id 
                    ? 'bg-slate-800/80 border-indigo-500/50 ring-1 ring-indigo-500/30' 
                    : 'bg-slate-800/40 border-slate-700/50 hover:border-indigo-500/30 hover:bg-slate-800/60'
                  } ${draggedItemIndex === index ? 'opacity-50' : 'opacity-100'}`}
                >
                  <div className="text-slate-600 cursor-grab active:cursor-grabbing hover:text-slate-400">
                    <GripVertical size={20} />
                  </div>

                  <div className={`w-12 h-12 rounded-full overflow-hidden border-2 shrink-0 ${item.category === 'manager' ? 'border-amber-500' : 'border-slate-500'}`}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] bg-slate-900 border border-slate-700 text-slate-400 px-2 py-0.5 rounded uppercase tracking-wider">
                            {getCategoryLabel(item.category)}
                        </span>
                    </div>
                    <h4 className="text-white font-bold text-base mb-0.5">{item.name}</h4>
                    <p className="text-slate-400 text-sm">{item.title}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEditClick(item)}
                      className={`p-2 rounded-lg transition-colors ${editingId === item.id ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10'}`}
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
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}