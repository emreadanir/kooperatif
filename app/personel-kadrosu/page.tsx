import React from 'react';
import Navbar from '../../components/Navbar'; 
import Footer from '../../components/Footer'; 

// ⭐️ YENİ: Personel Üyeleri için Tip Tanımı (Interface)
interface StaffMember {
  id: number;
  name: string;
  title: string;
  image: string;
  type: 'gold' | 'silver';
  // category alanını daha spesifik bir tip ile tanımladık
  category: 'manager' | 'accounting' | 'officer' | 'service'; 
}

// Personel Veri Seti (Tip uygulaması eklendi)
const staffMembers: StaffMember[] = [
  // 1. KOOPERATİF MÜDÜRÜ
  { 
    id: 1, 
    name: "Ayşe YILMAZ", 
    title: "Kooperatif Müdürü", 
    category: "manager", 
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayse&backgroundColor=b6e3f4", 
    type: "gold" 
  },
  
  // 2. MUHASEBE (3 Kişi)
  { id: 2, name: "Ali VELİ", title: "Muhasebe Şefi", category: "accounting", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ali&backgroundColor=c0aede", type: "silver" },
  { id: 3, name: "Canan SU", title: "Muhasebe Memuru", category: "accounting", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Canan&backgroundColor=ffdfbf", type: "silver" },
  { id: 4, name: "Burak CAN", title: "Muhasebe Memuru", category: "accounting", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Burak&backgroundColor=b6e3f4", type: "silver" },

  // 3. MEMURLAR (5 Kişi)
  { id: 5, name: "Fatma DEMİR", title: "Takip Memuru", category: "officer", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatma&backgroundColor=c0aede", type: "silver" },
  { id: 6, name: "Zeynep KAYA", title: "Veznedar", category: "officer", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zeynep&backgroundColor=b6e3f4", type: "silver" },
  { id: 7, name: "Ahmet KOÇ", title: "Kredi İşlemleri", category: "officer", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=AhmetK&backgroundColor=ffdfbf", type: "silver" },
  { id: 8, name: "Elif NUR", title: "İdari İşler", category: "officer", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elif&backgroundColor=c0aede", type: "silver" },
  { id: 9, name: "Mert ŞEN", title: "Arşiv Sorumlusu", category: "officer", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mert&backgroundColor=b6e3f4", type: "silver" },

  // 4. MÜSTAHDEM (2 Kişi)
  { id: 10, name: "Veli GÜÇ", title: "Yardımcı Personel", category: "service", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Veli&backgroundColor=ffdfbf", type: "silver" },
  { id: 11, name: "Hasan TEK", title: "Şoför / Hizmetli", category: "service", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=HasanT&backgroundColor=c0aede", type: "silver" }
];

export default function PersonelKadrosu() {
  
  // Filtrelenmiş sonuçlara tip ataması yapıldı.
  const manager: StaffMember | undefined = staffMembers.find(m => m.category === 'manager');
  const accountingTeam: StaffMember[] = staffMembers.filter(m => m.category === 'accounting');
  const officersTeam: StaffMember[] = staffMembers.filter(m => m.category === 'officer');
  const serviceTeam: StaffMember[] = staffMembers.filter(m => m.category === 'service');

  // Gümüş Kart Bileşeni (Tekrar Eden)
  // ⭐️ YENİ: Props için arayüz tanımı eklendi
  const SilverMemberCard = ({ member }: { member: StaffMember }) => (
    <div className="group flex flex-col items-center transform transition duration-300 hover:-translate-y-2">
      {/* Fotoğraf Çerçevesi (Gümüş Tema) */}
      <div className="relative w-40 h-52 p-1 rounded-lg bg-gradient-to-br from-slate-300 via-slate-400 to-slate-600 shadow-[0_0_15px_rgba(148,163,184,0.15)] group-hover:shadow-[0_0_25px_rgba(148,163,184,0.3)] transition-shadow duration-300">
        <div className="w-full h-full bg-slate-800 rounded overflow-hidden border-2 border-slate-900 relative">
           <img 
             src={member.image} 
             alt={member.name} 
             className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
           />
           {/* İnce Parlama Efekti */}
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60"></div>
        </div>
      </div>

      <div className="text-center mt-3">
        <h3 className="text-base font-bold text-slate-200 group-hover:text-cyan-100 transition-colors">
          {member.name}
        </h3>
        <p className="text-slate-400 text-[11px] mt-0.5 font-medium uppercase tracking-wide group-hover:text-slate-300 transition-colors">
          {member.title}
        </p>
        <div className="w-0 group-hover:w-8 h-0.5 bg-gradient-to-r from-slate-500 to-cyan-400 mx-auto mt-2 transition-all duration-300"></div>
      </div>
    </div>
  );

  // Bölüm Başlığı Bileşeni (Basit bir bileşen olduğu için inline tip tanımı yeterli)
  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center justify-center mb-8 mt-4">
        <div className="h-px bg-gradient-to-r from-transparent to-slate-600 w-16 sm:w-32"></div>
        <h2 className="mx-6 text-slate-300 text-sm font-bold uppercase tracking-[0.2em] text-center">
            {title}
        </h2>
        <div className="h-px bg-gradient-to-l from-transparent to-slate-600 w-16 sm:w-32"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 flex flex-col">
      <Navbar />
      
      {/* Ana Kapsayıcı */}
      <main className="flex-grow relative overflow-hidden">
        
        {/* --- GLOBAL ARKA PLAN EFEKTLERİ (Mesh Gradient) --- */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Başlık Işıkları */}
            <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen"></div>
            <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[100px] mix-blend-screen"></div>
            
            {/* Müdür Işığı (Altın Vurgu) */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/10 blur-[100px] rounded-full mix-blend-screen"></div>

            {/* Alt Bölüm Işıkları */}
            <div className="absolute top-[60%] right-[-15%] w-[800px] h-[800px] bg-slate-600/15 rounded-full blur-[140px] mix-blend-screen"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-800/15 rounded-full blur-[150px] mix-blend-screen"></div>
        </div>

        {/* --- BAŞLIK BÖLÜMÜ --- */}
        <div className="relative z-10 pt-16 pb-8 lg:pt-20 lg:pb-12 text-center">
            <div className="container mx-auto px-4">
                <div className="inline-flex items-center justify-center space-x-3 mb-4 opacity-90">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-indigo-400"></div>
                    <span className="text-indigo-400 font-bold tracking-[0.25em] uppercase text-xs">HİZMET & GÜVEN</span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-indigo-400"></div>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight drop-shadow-2xl">
                  Personel <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-slate-200 to-indigo-400">Kadrosu</span>
                </h1>
                
                <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
                  Esnafımıza güler yüzle ve profesyonellikle hizmet veren idari ve yardımcı kadromuz.
                </p>
                
                <div className="mt-8 w-full max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
            </div>
        </div>

        {/* --- İÇERİK ALANI --- */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-16">
            
            {/* 1. KOOPERATİF MÜDÜRÜ (Altın Tema) */}
            {manager && (
              <div className="flex justify-center">
                <div className="group relative flex flex-col items-center transform transition duration-500 hover:scale-105">
                  {/* Fotoğraf Çerçevesi */}
                  <div className="relative w-48 h-64 p-1.5 rounded-xl bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 shadow-[0_0_35px_rgba(245,158,11,0.3)] z-10">
                    <div className="w-full h-full bg-slate-800 rounded-lg overflow-hidden border-4 border-slate-900 relative">
                       <img src={manager.image} alt={manager.name} className="w-full h-full object-cover" />
                    </div>
                    {/* Altın Rozet */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-500 text-blue-950 text-[10px] font-bold px-4 py-1 rounded-full shadow-lg border border-amber-200 whitespace-nowrap uppercase tracking-wider">
                        MÜDÜR
                    </div>
                  </div>
                  <div className="text-center mt-5">
                    <h2 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors drop-shadow-md">{manager.name}</h2>
                    <p className="text-amber-400 font-medium text-sm mt-1 uppercase tracking-wider opacity-90">{manager.title}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. MUHASEBE SERVİSİ */}
            <div>
                <SectionHeader title="Muhasebe Servisi" />
                <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
                    {accountingTeam.map((member) => <SilverMemberCard key={member.id} member={member} />)}
                </div>
            </div>

            {/* 3. MEMURLAR */}
            <div>
                <SectionHeader title="Memurlar" />
                <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
                    {officersTeam.map((member) => <SilverMemberCard key={member.id} member={member} />)}
                </div>
            </div>

            {/* 4. YARDIMCI HİZMETLER */}
            <div>
                <SectionHeader title="Yardımcı Hizmetler" />
                <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
                    {serviceTeam.map((member) => <SilverMemberCard key={member.id} member={member} />)}
                </div>
            </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}