"use client";

import React from 'react';
import { ArrowLeft, FileText, Edit, Eye, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// Örnek Sayfa Verisi
const pages = [
  { id: 1, title: 'Anasayfa', slug: '/', status: 'Aktif', lastUpdated: '21.11.2024' },
  { id: 2, title: 'Kredi Çeşitleri', slug: '/kredi-cesitleri', status: 'Aktif', lastUpdated: '20.11.2024' },
  { id: 3, title: 'Kredi Kullanım Şartları', slug: '/kredi-kullanim-sartlari', status: 'Aktif', lastUpdated: '19.11.2024' },
  { id: 4, title: 'Faiz Oranları', slug: '/faiz-orani', status: 'Aktif', lastUpdated: '18.11.2024' },
  { id: 5, title: 'Kanun ve Yönetmelikler', slug: '/kanun-ve-yonetmelikler', status: 'Aktif', lastUpdated: '15.11.2024' },
  { id: 7, title: 'İletişim', slug: '/iletisim', status: 'Aktif', lastUpdated: '01.11.2024' },
];

export default function SayfalarYonetimi() {
  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 p-6 md:p-12">
      
      {/* Üst Başlık */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="text-blue-500" />
            Sayfa Yönetimi
          </h1>
          <p className="text-slate-400 text-sm mt-1">Web sitesindeki mevcut sayfaların listesi ve durumları.</p>
        </div>
        <Link href="/admin" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-slate-700 shrink-0">
            <ArrowLeft size={16} />
            Panele Dön
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        
        {/* Bilgi Kartı */}
        <div className="bg-blue-900/20 border border-blue-500/20 rounded-2xl p-4 mb-8 flex items-start gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 mt-0.5">
                <FileText size={20} />
            </div>
            <div>
                <h4 className="text-blue-200 font-bold text-sm">Bilgilendirme</h4>
                <p className="text-blue-300/70 text-xs mt-1 leading-relaxed">
                    Bu alanda sitenizde bulunan statik sayfaları görüntüleyebilirsiniz. Tüm içerik sayfaları için düzenleme modülleri aktif edilmiştir.
                </p>
            </div>
        </div>

        {/* Sayfa Listesi */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 bg-slate-900/50 p-4 border-b border-slate-700 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <div className="col-span-6 md:col-span-5 pl-2">Sayfa Adı</div>
                <div className="col-span-3 hidden md:block">URL (Slug)</div>
                <div className="col-span-3 md:col-span-2">Durum</div>
                <div className="col-span-3 md:col-span-2 text-right pr-2">İşlemler</div>
            </div>

            <div className="divide-y divide-slate-700/50">
                {pages.map((page) => (
                    <div key={page.id} className="grid grid-cols-12 p-4 hover:bg-slate-800/60 transition-colors items-center group">
                        <div className="col-span-6 md:col-span-5 pl-2">
                            <div className="font-bold text-slate-200 group-hover:text-white transition-colors">{page.title}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5 md:hidden">{page.slug}</div>
                        </div>
                        <div className="col-span-3 hidden md:block text-slate-400 text-sm font-mono">
                            {page.slug}
                        </div>
                        <div className="col-span-3 md:col-span-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wide">
                                <CheckCircle2 size={12} />
                                {page.status}
                            </span>
                        </div>
                        <div className="col-span-3 md:col-span-2 flex justify-end gap-2 pr-2">
                            <Link href={page.slug} target="_blank" title="Görüntüle" className="p-2 bg-slate-700/50 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-lg transition-all">
                                <Eye size={16} />
                            </Link>
                            
                            {/* ⭐️ GÜNCELLEME: Linkler */}
                            {page.slug === '/kredi-cesitleri' ? (
                                <Link href="/admin/sayfalar/kredi-cesitleri" className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-lg shadow-blue-500/20" title="İçeriği Düzenle">
                                    <Edit size={16} />
                                </Link>
                            ) : page.slug === '/kredi-kullanim-sartlari' ? (
                                <Link href="/admin/sayfalar/kredi-kullanim-sartlari" className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-lg shadow-blue-500/20" title="İçeriği Düzenle">
                                    <Edit size={16} />
                                </Link>
                            ) : page.slug === '/faiz-orani' ? (
                                <Link href="/admin/sayfalar/faiz-orani" className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-lg shadow-blue-500/20" title="İçeriği Düzenle">
                                    <Edit size={16} />
                                </Link>
                            ) : page.slug === '/kanun-ve-yonetmelikler' ? (
                                <Link href="/admin/sayfalar/kanun-ve-yonetmelikler" className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-lg shadow-blue-500/20" title="İçeriği Düzenle">
                                    <Edit size={16} />
                                </Link>
                            ) : page.slug === '/iletisim' ? (
                                <Link href="/admin/sayfalar/iletisim" className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-lg shadow-blue-500/20" title="İçeriği Düzenle">
                                    <Edit size={16} />
                                </Link>
                            ) : (
                                <button title="Düzenle (Yakında)" disabled className="p-2 bg-slate-700/30 text-slate-600 rounded-lg cursor-not-allowed opacity-50">
                                    <Edit size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}