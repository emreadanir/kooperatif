import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import { 
  LogOut, 
  LayoutDashboard, 
  Settings, 
  Megaphone, 
  Briefcase, 
  UserCheck, 
  FileSearch, 
  Users, 
  ChevronDown,
  Info,
  FileText // ⭐️ YENİ: Sayfalar ikonu eklendi
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const cookieName = process.env.COOKIE_NAME || 'admin_session';
  const isLoggedIn = cookieStore.has(cookieName);

  if (!isLoggedIn) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 font-sans flex">
      
      {/* SOL MENÜ (SIDEBAR) */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col fixed h-full">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white tracking-wide">Yönetim Paneli</h2>
          <p className="text-xs text-slate-500 mt-1">Kooperatif v1.0</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <Link href="/admin" className="px-4 py-3 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl flex items-center gap-3 font-medium cursor-pointer transition-colors">
            <LayoutDashboard size={20} />
            Anasayfa
          </Link>
          
          <Link href="/admin/duyurular" className="px-4 py-3 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl flex items-center gap-3 font-medium cursor-pointer transition-colors">
            <Megaphone size={20} />
            Duyurular
          </Link>

          {/* ⭐️ YENİ: SAYFALAR MENÜSÜ */}
          <Link href="/admin/sayfalar" className="px-4 py-3 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl flex items-center gap-3 font-medium cursor-pointer transition-colors">
            <FileText size={20} />
            Sayfalar
          </Link>

          <details className="group/kadro select-none" open>
            <summary className="px-4 py-3 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl flex items-center gap-3 font-medium cursor-pointer transition-colors list-none">
              <Briefcase size={20} />
              <span>Kadrolar</span>
              <ChevronDown size={16} className="ml-auto transition-transform duration-200 group-open/kadro:rotate-180 opacity-50" />
            </summary>
            
            <div className="pl-4 mt-1 space-y-1 border-l border-slate-800 ml-6">
              <Link href="/admin/kadrolar/yonetim-kurulu" className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg flex items-center gap-2 transition-colors">
                 <UserCheck size={16} />
                 Yönetim Kurulu
              </Link>
              
              <Link href="/admin/kadrolar/denetim-kurulu" className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg flex items-center gap-2 transition-colors">
                 <FileSearch size={16} />
                 Denetim Kurulu
              </Link>
              
              <Link href="/admin/kadrolar/personel-kadrosu" className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg flex items-center gap-2 transition-colors">
                 <Users size={16} />
                 Personel Kadrosu
              </Link>
            </div>
          </details>

          <div className="px-4 py-3 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl flex items-center gap-3 font-medium cursor-pointer transition-colors opacity-50 cursor-not-allowed" title="Yakında">
            <Settings size={20} />
            Ayarlar
          </div>
        </nav>
      </aside>

      {/* SAĞ İÇERİK ALANI */}
      <div className="flex-1 flex flex-col md:ml-64">
        
        {/* HEADER */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 md:px-8 sticky top-0 z-20">
           <h1 className="text-lg font-bold text-white md:hidden">Admin</h1>
           
           <div className="flex items-center gap-4 ml-auto">
              
              {/* GÜVENLİ ÇIKIŞ BUTONU */}
              <form action={logout}>
                <button className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-lg transition-all text-xs font-bold cursor-pointer">
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Güvenli Çıkış</span>
                </button>
              </form>

              {/* Ayırıcı Çizgi */}
              <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

              <div className="text-right hidden sm:block">
                 <p className="text-sm font-bold text-white">Admin Kullanıcısı</p>
                 <p className="text-xs text-slate-400">Süper Yönetici</p>
              </div>
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                A
              </div>
           </div>
        </header>

        <main className="flex-1 p-6 md:p-10 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
              <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
           </div>

           <div className="relative z-10 max-w-6xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Hoş Geldiniz</h2>
                <p className="text-slate-400">Sol menüyü kullanarak web sitesinin içeriğini yönetebilirsiniz. İşte yapabilecekleriniz:</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Tip 1: Duyurular */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 transition-all duration-300 group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 group-hover:scale-110 transition-transform">
                      <Megaphone size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Duyuru Yönetimi</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Web sitesinde yayınlanacak duyuruları ekleyebilir, düzenleyebilir veya silebilirsiniz. Önemli duyuruları "Acil" olarak işaretleyerek anasayfada öne çıkarabilirsiniz.
                  </p>
                </div>

                {/* Tip 2: Sayfalar (YENİ EKLENDİ) */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 transition-all duration-300 group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 group-hover:scale-110 transition-transform">
                      <FileText size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Sayfa Yönetimi</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Sitenizdeki "Hakkımızda", "İletişim" gibi temel sayfaların içeriklerini buradan düzenleyebilir ve yönetebilirsiniz.
                  </p>
                </div>

                {/* Tip 3: Yönetim Kurulu */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 transition-all duration-300 group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 group-hover:scale-110 transition-transform">
                      <UserCheck size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Yönetim Kadrosu</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Yönetim kurulu üyelerini ekleyebilir ve görevlerini güncelleyebilirsiniz. Listeyi sürükle-bırak yöntemiyle kolayca yeniden sıralayabilirsiniz.
                  </p>
                </div>

                {/* Tip 4: Diğer Kadrolar */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 transition-all duration-300 group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20 group-hover:scale-110 transition-transform">
                      <Users size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Diğer Kadrolar</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Denetim kurulu üyelerini ve idari personelleri yönetebilirsiniz. Personelleri "Muhasebe", "Memur" gibi kategorilere ayırarak düzenli bir görünüm sağlayabilirsiniz.
                  </p>
                </div>

              </div>
           </div>
        </main>
      </div>
    </div>
  );
}