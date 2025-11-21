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
  Save, ArrowLeft, Loader2, MapPin, Phone, Mail, Globe, Info, Plus, Trash2
} from 'lucide-react';
import Link from 'next/link';

// Veri Tipleri
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
  phone?: string;
  phoneNote?: string;
  email?: string;
  emailNote?: string;
}

export default function IletisimYonetimi() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [address, setAddress] = useState('Cumhuriyet Mah. Atatürk Cad. No:123');
  const [city, setCity] = useState('Merkez / TÜRKİYE');
  
  const [phones, setPhones] = useState<PhoneItem[]>([
    { number: '0 (212) 123 45 67', note: 'Hafta içi 08:30 - 17:30' }
  ]);
  const [emails, setEmails] = useState<EmailItem[]>([
    { address: 'bilgi@kooperatif.org.tr', note: '7/24 e-posta gönderebilirsiniz' }
  ]);
  
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');

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
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'page-content', 'contact-info');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as ContactData;
          setAddress(data.address || '');
          setCity(data.city || '');
          setMapEmbedUrl(data.mapEmbedUrl || '');

          if (data.phones && data.phones.length > 0) {
            setPhones(data.phones);
          } else if (data.phone) {
            setPhones([{ number: data.phone, note: data.phoneNote || '' }]);
          }

          if (data.emails && data.emails.length > 0) {
            setEmails(data.emails);
          } else if (data.email) {
            setEmails([{ address: data.email, note: data.emailNote || '' }]);
          }
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
      const validPhones = phones.filter(p => p.number.trim() !== '');
      const validEmails = emails.filter(e => e.address.trim() !== '');

      const dataToSave: ContactData = {
        address,
        city,
        phones: validPhones,
        emails: validEmails,
        mapEmbedUrl
      };

      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'page-content', 'contact-info'), dataToSave, { merge: true });
      
      alert("İletişim bilgileri başarıyla güncellendi!");
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- TELEFON YÖNETİMİ ---
  const addPhone = () => setPhones([...phones, { number: '', note: '' }]);
  const removePhone = (index: number) => setPhones(phones.filter((_, i) => i !== index));
  const updatePhone = (index: number, field: keyof PhoneItem, value: string) => {
    const newPhones = [...phones];
    newPhones[index][field] = value;
    setPhones(newPhones);
  };

  // --- E-POSTA YÖNETİMİ ---
  const addEmail = () => setEmails([...emails, { address: '', note: '' }]);
  const removeEmail = (index: number) => setEmails(emails.filter((_, i) => i !== index));
  const updateEmail = (index: number, field: keyof EmailItem, value: string) => {
    const newEmails = [...emails];
    newEmails[index][field] = value;
    setEmails(newEmails);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 p-6 md:p-12">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Phone className="text-cyan-500" />
            İletişim Bilgileri
          </h1>
          <p className="text-slate-400 text-sm mt-1">Sitedeki iletişim bilgilerini ve harita konumunu buradan yönetebilirsiniz.</p>
        </div>
        <Link href="/admin/sayfalar" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-slate-700">
            <ArrowLeft size={16} />
            Geri Dön
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
        
        {/* ⭐️ GÜNCELLEME: Grid yapısı değiştirildi. Sol sütun: Adres & Harita, Sağ Sütun: İletişim Kanalları */}
        <div className="grid lg:grid-cols-12 gap-8">
            
            {/* SOL SÜTUN (5 BİRİM) - LOKASYON BİLGİLERİ */}
            <div className="lg:col-span-5 space-y-6">
                
                {/* ADRES BİLGİLERİ */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 space-y-5">
                    <div className="flex items-center gap-3 mb-2 border-b border-slate-700 pb-3">
                        <MapPin className="text-cyan-400" size={20} />
                        <h3 className="text-lg font-bold text-white">Adres Bilgileri</h3>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase">Açık Adres</label>
                        <textarea 
                            rows={4}
                            className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none h-32"
                            placeholder="Mahalle, Cadde, Sokak, No..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase">İlçe / Şehir / Ülke</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                            placeholder="Merkez / TÜRKİYE"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                </div>

                {/* HARİTA EMBED ALANI */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-4">
                        <Globe className="text-emerald-400" size={24} />
                        <h3 className="text-xl font-bold text-white">Google Harita</h3>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-400">Embed Linki (src)</label>
                        <div className="flex gap-3 flex-col md:flex-row">
                            <input 
                                type="text" 
                                className="flex-1 bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono text-xs"
                                placeholder="https://www.google.com/maps/embed?pb=..."
                                value={mapEmbedUrl}
                                onChange={(e) => setMapEmbedUrl(e.target.value)}
                            />
                            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/30 px-3 py-2 md:py-0 rounded-lg border border-slate-700/50 whitespace-nowrap overflow-hidden text-ellipsis">
                                <Info size={14} className="shrink-0" />
                                <span className="truncate">Google Maps &quot;Paylaş &gt; Harita Yerleştir&quot; kısmındaki src linki</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Google Maps &quot;Paylaş &gt; Harita Yerleştir&quot; kısmındaki iframe kodu içindeki src linkini yapıştırın.</p>
                    </div>

                    {/* Önizleme */}
                    {mapEmbedUrl && (
                        <div className="mt-4 rounded-xl overflow-hidden border border-slate-700 h-48 w-full bg-slate-900 shadow-inner">
                            <iframe 
                                src={mapEmbedUrl} 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    )}
                </div>

            </div>

            {/* SAĞ SÜTUN (7 BİRİM) - İLETİŞİM KANALLARI */}
            <div className="lg:col-span-7 space-y-6">
                
                {/* Telefonlar */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-3">
                        <Phone className="text-indigo-400" size={20} />
                        <h3 className="text-lg font-bold text-white">Telefon Numaraları</h3>
                    </div>
                    
                    <div className="space-y-4">
                        {phones.map((item, index) => (
                            <div key={index} className="flex gap-2 items-start bg-slate-900/30 p-4 rounded-xl border border-slate-700/50 relative group">
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 uppercase font-bold">Numara</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                                            placeholder="0 (224)..."
                                            value={item.number}
                                            onChange={(e) => updatePhone(index, 'number', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 uppercase font-bold">Not / Açıklama</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-transparent border-b border-slate-700 px-1 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 placeholder-slate-600"
                                            placeholder="Örn: Mesai saatleri..."
                                            value={item.note}
                                            onChange={(e) => updatePhone(index, 'note', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => removePhone(index)}
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                                    title="Sil"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        <button 
                            type="button"
                            onClick={addPhone}
                            className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 px-4 py-3 rounded-xl hover:bg-indigo-500/10 transition-colors w-full justify-center border border-dashed border-indigo-500/30 hover:border-indigo-500/60"
                        >
                            <Plus size={16} /> Yeni Telefon Ekle
                        </button>
                    </div>
                </div>

                {/* E-Postalar */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-3">
                        <Mail className="text-purple-400" size={20} />
                        <h3 className="text-lg font-bold text-white">E-Posta Adresleri</h3>
                    </div>
                    
                    <div className="space-y-4">
                        {emails.map((item, index) => (
                            <div key={index} className="flex gap-2 items-start bg-slate-900/30 p-4 rounded-xl border border-slate-700/50 relative group">
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 uppercase font-bold">E-Posta</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                                            placeholder="ornek@mail.com"
                                            value={item.address}
                                            onChange={(e) => updateEmail(index, 'address', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 uppercase font-bold">Not / Açıklama</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-transparent border-b border-slate-700 px-1 py-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500 placeholder-slate-600"
                                            placeholder="Örn: 7/24 destek..."
                                            value={item.note}
                                            onChange={(e) => updateEmail(index, 'note', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => removeEmail(index)}
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                                    title="Sil"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        <button 
                            type="button"
                            onClick={addEmail}
                            className="flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300 px-4 py-3 rounded-xl hover:bg-purple-500/10 transition-colors w-full justify-center border border-dashed border-purple-500/30 hover:border-purple-500/60"
                        >
                            <Plus size={16} /> Yeni E-Posta Ekle
                        </button>
                    </div>
                </div>

            </div>
        </div>

        {/* KAYDET BUTONU */}
        <div className="sticky bottom-6 flex justify-end mt-8">
            <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-cyan-900/30 transition-all transform hover:scale-105 flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed z-50"
            >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Değişiklikleri Kaydet
            </button>
        </div>

      </form>
    </div>
  );
}