"use client";

import React, { useState, useEffect, useRef } from 'react';
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
  writeBatch // ⭐️ YENİ: Toplu işlem için
} from 'firebase/firestore';
import { auth, db, appId } from '@/lib/firebase';
import { Megaphone, Trash2, Plus, Loader2, Calendar, AlertCircle, ArrowLeft, FileText, Edit, X, GripVertical } from 'lucide-react';
import Link from 'next/link';

// Duyuru Tipi
interface Announcement {
  id: string;
  title: string;
  summary: string;
  content?: string;
  date: string;
  category: string;
  urgent: boolean;
  order: number;
}

export default function DuyuruYonetimi() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  
  // Sürükle-Bırak State'leri
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Bugünün tarihini al
  const getTodayString = () => {
    return new Date().toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Form State'leri
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(''); 
  const [category, setCategory] = useState('Duyuru');
  const [urgent, setUrgent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Düzenleme Modu State'i
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setDate(getTodayString());
  }, []);

  // 1. Firebase Oturum Açma
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else signInAnonymously(auth).catch((err) => console.error("Giriş hatası:", err));
    });
    return () => unsub();
  }, []);

  // 2. Duyuruları Listeleme
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'artifacts', appId, 'public', 'data', 'announcements'),
      orderBy('order', 'asc') 
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Eğer sürükleme işlemi yapılıyorsa snapshot güncellemesini yoksay (titremeyi önlemek için)
      if (isDragging) return;

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Announcement[];
      setAnnouncements(data);
      setLoading(false);
    }, (error) => {
      console.error("Veri çekme hatası:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isDragging]);

  // --- SÜRÜKLE BIRAK FONKSİYONLARI ---

  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
    setIsDragging(true);
  };

  const handleDragEnter = (index: number) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    // Listeyi yerel olarak yeniden sırala (Görsel Geri Bildirim)
    const newItems = [...announcements];
    const draggedItem = newItems[draggedItemIndex];
    
    // Öğeyi eski yerinden çıkar
    newItems.splice(draggedItemIndex, 1);
    // Yeni yerine ekle
    newItems.splice(index, 0, draggedItem);

    setDraggedItemIndex(index);
    setAnnouncements(newItems);
  };

  const handleDragEnd = async () => {
    setIsDragging(false);
    setDraggedItemIndex(null);

    // Yeni sıralamayı veritabanına kaydet (Batch Update)
    try {
      const batch = writeBatch(db);
      
      announcements.forEach((item, index) => {
        const newOrder = index + 1;
        // Sadece sırası değişenleri güncellemek performansı artırır ama
        // batch işleminde hepsini yazmak mantık hatasını önler.
        if (item.order !== newOrder) {
            const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'announcements', item.id);
            batch.update(docRef, { order: newOrder });
        }
      });

      await batch.commit();
      console.log("Sıralama güncellendi.");
    } catch (error) {
      console.error("Sıralama güncelleme hatası:", error);
      alert("Sıralama kaydedilirken bir hata oluştu.");
    }
  };

  // --- FORM FONKSİYONLARI ---

  const resetForm = () => {
    setTitle('');
    setSummary('');
    setContent('');
    setDate(getTodayString());
    setCategory('Duyuru');
    setUrgent(false);
    setEditingId(null);
  };

  const handleEditClick = (item: Announcement) => {
    setTitle(item.title);
    setSummary(item.summary);
    setContent(item.content || item.summary);
    setDate(item.date);
    setCategory(item.category);
    setUrgent(item.urgent);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title || !summary || !date) return;

    setIsSubmitting(true);
    try {
      const docData = {
        title,
        summary,
        content: content || summary,
        date,
        category,
        urgent,
        // Yeni eklenenler listenin en sonuna gider
        ...(editingId ? {} : { createdAt: serverTimestamp(), order: announcements.length + 1 })
      };

      if (editingId) {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'announcements', editingId);
        await updateDoc(docRef, docData);
      } else {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'announcements'), docData);
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
    if (!confirm("Bu duyuruyu silmek istediğinize emin misiniz?")) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'announcements', id));
      if (editingId === id) resetForm();
    } catch (error) {
      console.error("Silme hatası:", error);
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
      
      {/* Üst Başlık */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Megaphone className="text-amber-500" />
            Duyuru Yönetimi
          </h1>
          <p className="text-slate-400 text-sm mt-1">Listeyi sürükle-bırak yaparak sıralayabilirsiniz.</p>
        </div>
        <Link href="/admin" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-slate-700 shrink-0">
            <ArrowLeft size={16} />
            Panele Dön
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">
        
        {/* --- SOL: FORM ALANI --- */}
        <div className="lg:col-span-4">
          <div className={`bg-slate-800/50 border rounded-2xl p-6 sticky top-6 overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar transition-colors duration-300 ${editingId ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'border-slate-700/50'}`}>
            
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold flex items-center gap-2 ${editingId ? 'text-amber-400' : 'text-white'}`}>
                {editingId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5 text-indigo-400" />}
                {editingId ? 'Duyuruyu Düzenle' : 'Yeni Duyuru Ekle'}
              </h3>
              {editingId && (
                <button onClick={resetForm} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded transition-colors">
                  <X size={12} /> Vazgeç
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Başlık</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                  placeholder="Örn: Genel Kurul Toplantısı"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tarih</label>
                    <input 
                    type="text" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="Örn: 21 Kasım 2025"
                    required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Kategori</label>
                    <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                    >
                    <option>Duyuru</option>
                    <option>Genel Kurul</option>
                    <option>Kredi</option>
                    <option>Mesai</option>
                    <option>Bayram</option>
                    <option>Haber</option>
                    </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Kısa Özet (Ana Sayfa)</label>
                <textarea 
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm resize-none"
                  placeholder="Slider'da görünecek kısa açıklama..."
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-2">
                    <FileText size={12} /> Detaylı İçerik (Pop-up)
                </label>
                <textarea 
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm resize-none"
                  placeholder="Duyurunun tamamı buraya yazılacak. Boş bırakılırsa özet kullanılır."
                ></textarea>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg border border-slate-700/50 cursor-pointer hover:bg-slate-900/50 transition-colors" onClick={() => setUrgent(!urgent)}>
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${urgent ? 'bg-red-500 border-red-500' : 'border-slate-500'}`}>
                  {urgent && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <span className={`text-sm font-medium ${urgent ? 'text-red-400' : 'text-slate-400'}`}>Önemli / Acil Duyuru</span>
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
                {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : (editingId ? 'Güncelle' : 'Yayınla')}
              </button>

            </form>
          </div>
        </div>

        {/* --- SAĞ: LİSTE (SÜRÜKLE-BIRAK) --- */}
        <div className="lg:col-span-8">
          <div className="space-y-3">
            {announcements.length === 0 ? (
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[300px]">
                <div className="bg-slate-800 p-4 rounded-full mb-4">
                    <AlertCircle className="w-8 h-8 opacity-50" />
                </div>
                <p className="text-lg font-medium text-slate-400">Henüz hiç duyuru eklenmemiş.</p>
                <p className="text-sm mt-2">Soldaki formu kullanarak ilk duyurunuzu ekleyebilirsiniz.</p>
              </div>
            ) : (
              announcements.map((item, index) => (
                <div 
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()} // Drop için gerekli
                  className={`bg-slate-800/40 border rounded-xl p-4 transition-all group relative flex gap-4 items-start select-none cursor-grab active:cursor-grabbing ${
                    editingId === item.id 
                    ? 'border-amber-500/50 ring-1 ring-amber-500/30 bg-slate-800/80' 
                    : 'border-slate-700/50 hover:border-indigo-500/30 hover:bg-slate-800/60'
                  } ${draggedItemIndex === index ? 'opacity-50' : 'opacity-100'}`}
                >
                  {/* Tutamaç İkonu */}
                  <div className="mt-2 text-slate-600 cursor-grab active:cursor-grabbing hover:text-slate-400">
                    <GripVertical size={20} />
                  </div>

                  {/* Sıra Numarası */}
                  <div className="flex flex-col items-center justify-center bg-slate-900/50 rounded-lg px-2 py-2 border border-slate-700 min-w-[40px] h-full shrink-0">
                      <span className="text-[9px] text-slate-500 uppercase font-bold">Sıra</span>
                      <span className="text-lg font-bold text-white">{index + 1}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                        item.urgent 
                        ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                        : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                      }`}>
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 bg-slate-900/50 px-2 py-0.5 rounded shrink-0">
                        <Calendar size={12} />
                        {item.date}
                      </span>
                    </div>
                    <h4 className="text-white font-bold text-base mb-1 break-all">{item.title}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed break-all whitespace-pre-wrap line-clamp-2">{item.summary}</p>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button 
                      onClick={() => handleEditClick(item)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        editingId === item.id 
                        ? 'bg-amber-500 text-white' 
                        : 'text-slate-500 hover:text-amber-400 hover:bg-amber-500/10'
                      }`}
                      title="Düzenle"
                    >
                      <Edit size={16} />
                    </button>

                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-500 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 size={16} />
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