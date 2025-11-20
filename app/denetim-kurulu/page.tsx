import React from 'react';
import Navbar from '../../components/Navbar'; 
import Footer from '../../components/Footer'; 

// ⭐️ YENİ: Kurul Üyeleri için Tip Tanımı (Interface)
interface Member {
  id: number;
  name: string;
  title: string;
  image: string;
  type: 'silver';
}

// Örnek Veri Seti - Denetim Kurulu (Tip uygulaması eklendi)
const auditMembers: Member[] = [
  {
    id: 1,
    name: "Mustafa YILDIZ",
    title: "Denetim Kurulu Üyesi",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mustafa&backgroundColor=c0aede", 
    type: "silver" 
  },
  {
    id: 2,
    name: "Kemal TAŞ",
    title: "Denetim Kurulu Üyesi",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kemal&backgroundColor=b6e3f4",
    type: "silver" 
  }
];

export default function DenetimKurulu() {

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 flex flex-col">
      <Navbar />
      
      {/* Ana Kapsayıcı: Tüm sayfa arka plan efektleri burada yönetiliyor */}
      <main className="flex-grow relative overflow-hidden">
        
        {/* --- PLATİN/GÜMÜŞ TEMA ARKA PLAN EFEKTLERİ (Global Mesh Gradient) --- */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* 1. Üst Sağ Köşe - Soğuk Gümüş Işıltısı */}
            <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-slate-500/20 rounded-full blur-[120px] mix-blend-screen"></div>
            
            {/* 2. Üst Sol Köşe - Buz Mavisi Vurgu */}
            <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[100px] mix-blend-screen"></div>
            
            {/* 3. Orta Bölüm - Beyaz/Platin Işık (Üyelerin arkasına doğru süzülen) */}
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-slate-400/10 blur-[90px] rounded-full mix-blend-screen"></div>

            {/* 4. Alt Kısımlar - Sayfa sonuna doğru devamlılık */}
            <div className="absolute top-[60%] right-[-15%] w-[800px] h-[800px] bg-slate-600/15 rounded-full blur-[140px] mix-blend-screen"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-cyan-800/15 rounded-full blur-[150px] mix-blend-screen"></div>
        </div>

        {/* --- BAŞLIK BÖLÜMÜ (Yönetim Kurulu ile Eşitlendi) --- */}
        <div className="relative z-10 pt-16 pb-8 lg:pt-20 lg:pb-12 text-center">
            <div className="container mx-auto px-4">
                
                {/* Üst Başlık (Tagline) */}
                <div className="inline-flex items-center justify-center space-x-3 mb-4 opacity-90">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-slate-400"></div>
                    <span className="text-slate-300 font-bold tracking-[0.25em] uppercase text-xs">ŞEFFAFLIK & GÜVEN</span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-slate-400"></div>
                </div>
                
                {/* Ana Başlık - Boyutlar Küçültüldü */}
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight drop-shadow-2xl">
                  Denetim <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-cyan-200 to-slate-400">Kurulu</span>
                </h1>
                
                {/* Açıklama - Boyutlar Küçültüldü */}
                <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
                  Kooperatifimizin işleyişini, mali yapısını ve mevzuata uygunluğunu denetleyen yetkili organımız.
                </p>
                
                {/* Dekoratif Çizgi - Yaklaştırıldı */}
                <div className="mt-8 w-full max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
            </div>
        </div>

        {/* --- ÜYE KARTLARI BÖLÜMÜ --- */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            
            {/* Grid Yapısı - Üyeler merkeze hizalı */}
            <div className="flex flex-wrap justify-center gap-12 mt-8">
                {auditMembers.map((member) => (
                  <div key={member.id} className="group flex flex-col items-center transform transition duration-300 hover:-translate-y-2">
                    
                    {/* Fotoğraf Çerçevesi (Gümüş Tema) */}
                    <div className="relative w-56 h-72 p-1.5 rounded-lg bg-gradient-to-br from-slate-300 via-slate-400 to-slate-600 shadow-[0_0_25px_rgba(148,163,184,0.15)] group-hover:shadow-[0_0_40px_rgba(148,163,184,0.35)] transition-shadow duration-300">
                      <div className="w-full h-full bg-slate-800 rounded overflow-hidden border-2 border-slate-900 relative">
                         <img 
                           src={member.image} 
                           alt={member.name} 
                           className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                         />
                         {/* İnce Parlama Efekti (Overlay) */}
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60"></div>
                      </div>
                    </div>

                    {/* İsim ve Ünvan */}
                    <div className="text-center mt-5">
                      <h3 className="text-2xl font-bold text-slate-100 group-hover:text-cyan-100 transition-colors drop-shadow-sm">
                        {member.name}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1 font-medium uppercase tracking-wider group-hover:text-slate-300 transition-colors">
                        {member.title}
                      </p>
                      
                      {/* Alt Çizgi Animasyonu */}
                      <div className="w-0 group-hover:w-12 h-0.5 bg-gradient-to-r from-slate-500 to-cyan-400 mx-auto mt-3 transition-all duration-300"></div>
                    </div>
                  </div>
                ))}
            </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}