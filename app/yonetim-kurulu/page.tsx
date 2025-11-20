import React from 'react';
import Navbar from '../../components/Navbar'; 
import Footer from '../../components/Footer'; 

// ⭐️ YENİ: Kurul Üyeleri için Tip Tanımı (Interface)
interface Member {
  id: number;
  name: string;
  title: string;
  image: string;
  // type, 'gold' (Başkan) veya 'silver' (Üye) olabilir
  type: 'gold' | 'silver'; 
}

// Örnek Veri Seti (Tip uygulaması eklendi)
const boardMembers: Member[] = [
  {
    id: 1,
    name: "Ahmet SALDIZ",
    title: "Yönetim Kurulu Başkanı",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmet&backgroundColor=b6e3f4", 
    type: "gold" // Başkan
  },
  {
    id: 2,
    name: "Ali AKÇA",
    title: "Başkan Vekili",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ali&backgroundColor=c0aede",
    type: "silver"
  },
  {
    id: 3,
    name: "Bülent ÇETİN",
    title: "Yönetim Kurulu Üyesi",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bulent&backgroundColor=ffdfbf",
    type: "silver"
  },
  {
    id: 4,
    name: "Mehmet YILMAZ",
    title: "Yönetim Kurulu Üyesi",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mehmet&backgroundColor=c0aede",
    type: "silver"
  },
  {
    id: 5,
    name: "Hasan DEMİR",
    title: "Yönetim Kurulu Üyesi",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hasan&backgroundColor=b6e3f4",
    type: "silver"
  }
];

export default function YonetimKurulu() {
  
  // Filtreleme sonuçlarına da tip uygulayabiliriz (isteğe bağlı ama önerilir)
  const president = boardMembers.find((m): m is Member => m.type === 'gold');
  const members = boardMembers.filter(m => m.type !== 'gold') as Member[];

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 flex flex-col">
      <Navbar />
      
      {/* Main kapsayıcıya 'relative' ve 'overflow-hidden' ekleyerek tüm arka plan efektlerini burada yönetiyoruz */}
      <main className="flex-grow relative overflow-hidden">
        
        {/* --- GÜÇLENDİRİLMİŞ TÜM SAYFA ARKA PLAN EFEKTLERİ --- */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* 1. Üst Sağ Köşe (Başlık için) - Opaklık artırıldı (%20) */}
            <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-amber-500/20 rounded-full blur-[120px] mix-blend-screen"></div>
            
            {/* 2. Üst Sol Köşe (Başlık için) */}
            <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] bg-yellow-600/20 rounded-full blur-[100px] mix-blend-screen"></div>
            
            {/* 3. Orta Bölüm (Başkanın Arkası) - Işık daha belirgin hale getirildi */}
            <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-amber-400/15 blur-[90px] rounded-full mix-blend-screen"></div>

            {/* 4. Alt Sağ Bölüm (Üyeler için) - Konum ayarlandı ve güçlendirildi */}
            <div className="absolute top-[55%] right-[-10%] w-[800px] h-[800px] bg-amber-600/15 rounded-full blur-[140px] mix-blend-screen"></div>
            
            {/* 5. Alt Sol Bölüm (Üyeler için) */}
            <div className="absolute bottom-[-5%] left-[-5%] w-[700px] h-[700px] bg-yellow-500/15 rounded-full blur-[150px] mix-blend-screen"></div>

            {/* 6. Ekstra Merkez Işıltısı (Üyelerin tam arkasına denk gelir) */}
            <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-amber-300/5 blur-[100px] rounded-full"></div>
        </div>

        {/* --- BAŞLIK BÖLÜMÜ (DAHA KOMPAKT) --- */}
        <div className="relative z-10 pt-16 pb-8 lg:pt-20 lg:pb-12 text-center">
            <div className="container mx-auto px-4">
                {/* Üst Başlık - Küçültüldü */}
                <div className="inline-flex items-center justify-center space-x-3 mb-4 opacity-90">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500"></div>
                    <span className="text-amber-500 font-bold tracking-[0.25em] uppercase text-xs">LİDERLİK & VİZYON</span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-500"></div>
                </div>
                
                {/* Ana Başlık - Küçültüldü */}
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight drop-shadow-2xl">
                  Yönetim <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-500 to-amber-700">Kurulu</span>
                </h1>
                
                {/* Açıklama - Küçültüldü */}
                <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
                  Kooperatifimizin stratejik kararlarına yön veren, tecrübe ve güveni temsil eden idari kadromuz.
                </p>
                
                {/* Çizgi - Yaklaştırıldı */}
                <div className="mt-8 w-full max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
            </div>
        </div>

        {/* --- KİŞİ KARTLARI BÖLÜMÜ --- */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-12">
            
            {/* 1. BÖLÜM: BAŞKAN (Altın Tema) */}
            {president && (
              <div className="flex justify-center">
                <div className="group relative flex flex-col items-center transform transition duration-500 hover:scale-105">
                  {/* Fotoğraf Çerçevesi */}
                  <div className="relative w-48 h-64 p-1.5 rounded-xl bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 shadow-[0_0_35px_rgba(245,158,11,0.4)] z-10">
                    <div className="w-full h-full bg-slate-800 rounded-lg overflow-hidden border-4 border-slate-900 relative">
                       <img 
                         src={president.image} 
                         alt={president.name} 
                         className="w-full h-full object-cover"
                       />
                    </div>
                    {/* Altın Rozet */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-500 text-blue-950 text-[10px] font-bold px-4 py-1 rounded-full shadow-lg border border-amber-200 whitespace-nowrap uppercase tracking-wider">
                        BAŞKAN
                    </div>
                  </div>

                  <div className="text-center mt-5">
                    <h2 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors drop-shadow-md">
                      {president.name}
                    </h2>
                    <p className="text-amber-400 font-medium text-sm mt-1 uppercase tracking-wider opacity-90">
                      {president.title}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. BÖLÜM: ÜYELER (Gümüş Tema) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 justify-center">
                {members.map((member) => (
                  <div key={member.id} className="group flex flex-col items-center transform transition duration-300 hover:-translate-y-2">
                    {/* Fotoğraf Çerçevesi */}
                    <div className="relative w-40 h-52 p-1 rounded-lg bg-gradient-to-br from-slate-300 via-slate-400 to-slate-600 shadow-[0_0_20px_rgba(148,163,184,0.15)] group-hover:shadow-[0_0_30px_rgba(148,163,184,0.3)] transition-shadow duration-300">
                      <div className="w-full h-full bg-slate-800 rounded overflow-hidden border-2 border-slate-900">
                         <img 
                           src={member.image} 
                           alt={member.name} 
                           className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                         />
                      </div>
                    </div>

                    <div className="text-center mt-3">
                      <h3 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-slate-400 text-[11px] mt-0.5 font-medium uppercase tracking-wide group-hover:text-slate-300 transition-colors">
                        {member.title}
                      </p>
                      {/* Alt Çizgi Animasyonu */}
                      <div className="w-0 group-hover:w-8 h-0.5 bg-gradient-to-r from-slate-500 to-slate-300 mx-auto mt-2 transition-all duration-300"></div>
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