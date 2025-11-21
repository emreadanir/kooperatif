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
  ChevronDown 
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
              
              {/* ⭐️ Personel Kadrosu Linki Eklendi */}
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

        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <form action={logout}>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl transition-all text-sm font-bold">
              <LogOut size={18} />
              Güvenli Çıkış
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 flex flex-col md:ml-64">
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 md:px-8 sticky top-0 z-20">
           <h1 className="text-lg font-bold text-white md:hidden">Admin</h1>
           <div className="flex items-center gap-4 ml-auto">
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
                <p className="text-slate-400">Burası yönetim panelinin başlangıç sayfasıdır. Sol menüden sitenin içeriğini yönetebilirsiniz.</p>
              </div>

              <div className="border-2 border-dashed border-slate-700/50 rounded-3xl h-96 flex flex-col items-center justify-center text-slate-500 bg-slate-800/20 hover:bg-slate-800/30 transition-colors">
                 <div className="p-4 bg-slate-800 rounded-2xl mb-4 border border-slate-700">
                    <LayoutDashboard size={48} className="text-indigo-400 opacity-80" />
                 </div>
                 <p className="text-lg font-medium text-slate-300">Panel Özeti</p>
                 <p className="text-sm mt-2 text-slate-500">İleride buraya istatistikler eklenecektir.</p>
              </div>
           </div>
        </main>
      </div>
    </div>
  );
}