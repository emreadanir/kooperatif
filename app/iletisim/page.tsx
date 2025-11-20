import React from 'react';
import Navbar from '../../components/Navbar'; 
import Footer from '../../components/Footer'; 
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';

// ⭐️ YENİ: Bileşene tip ataması yapıldı
const Iletisim: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 flex flex-col">
      <Navbar />
      
      {/* Ana Kapsayıcı: Arka plan efektleri */}
      <main className="flex-grow relative overflow-hidden">
        
        {/* --- GLOBAL ARKA PLAN EFEKTLERİ (Mesh Gradient - İndigo/Cyan Tema) --- */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Üst Sağ - İndigo Işıltısı */}
            <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen"></div>
            
            {/* Üst Sol - Cyan Vurgu (İletişim/Teknoloji) */}
            <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[100px] mix-blend-screen"></div>
            
            {/* Orta Bölüm - Mavi Geçiş */}
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/10 blur-[90px] rounded-full mix-blend-screen"></div>

            {/* Alt Kısımlar - Devamlılık */}
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-900/15 rounded-full blur-[150px] mix-blend-screen"></div>
        </div>

        {/* --- BAŞLIK BÖLÜMÜ --- */}
        <div className="relative z-10 pt-20 pb-12 lg:pt-24 lg:pb-16 text-center">
            <div className="container mx-auto px-4">
                
                {/* Üst Başlık */}
                <div className="inline-flex items-center justify-center space-x-3 mb-4 opacity-90">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-400"></div>
                    <span className="text-cyan-400 font-bold tracking-[0.25em] uppercase text-xs md:text-sm">7/24 DESTEK</span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-400"></div>
                </div>
                
                {/* Ana Başlık */}
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl">
                  Bize <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Ulaşın</span>
                </h1>
                
                {/* Açıklama */}
                <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
                  Sorularınız, görüşleriniz veya kredi başvurularınız için bizimle dilediğiniz zaman iletişime geçebilirsiniz.
                </p>
                
                <div className="mt-12 w-full max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
            </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                
                {/* SOL KOLON: İLETİŞİM BİLGİLERİ */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Adres Kartı */}
                    <div className="group p-6 bg-slate-800/40 backdrop-blur-sm border border-slate-700/60 rounded-2xl hover:bg-slate-800/60 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10">
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                            <MapPin className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Merkez Ofis</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Cumhuriyet Mah. Atatürk Cad. No:123<br/>Merkez / TÜRKİYE
                        </p>
                    </div>

                    {/* Telefon Kartı */}
                    <div className="group p-6 bg-slate-800/40 backdrop-blur-sm border border-slate-700/60 rounded-2xl hover:bg-slate-800/60 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                            <Phone className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Telefon</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            0 (212) 123 45 67
                        </p>
                        <p className="text-slate-500 text-xs mt-1">Hafta içi 08:30 - 17:30</p>
                    </div>

                    {/* E-posta Kartı */}
                    <div className="group p-6 bg-slate-800/40 backdrop-blur-sm border border-slate-700/60 rounded-2xl hover:bg-slate-800/60 transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                            <Mail className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">E-Posta</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            bilgi@kooperatif.org.tr
                        </p>
                        <p className="text-slate-500 text-xs mt-1">7/24 e-posta gönderebilirsiniz</p>
                    </div>

                </div>

                {/* SAĞ KOLON: İLETİŞİM FORMU */}
                <div className="lg:col-span-2">
                    <div className="h-full bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 lg:p-10 relative overflow-hidden">
                        {/* Form Arkaplan Efekti */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
                                    <MessageSquare className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Mesaj Gönderin</h3>
                                    <p className="text-slate-400 text-sm">Size en kısa sürede dönüş yapacağız.</p>
                                </div>
                            </div>

                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium text-slate-300 ml-1">Adınız Soyadınız</label>
                                        <input 
                                          type="text" 
                                          id="name"
                                          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                                          placeholder="Adınız Soyadınız"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-slate-300 ml-1">E-Posta Adresiniz</label>
                                        <input 
                                          type="email" 
                                          id="email"
                                          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                                          placeholder="ornek@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-medium text-slate-300 ml-1">Konu</label>
                                    <select id="subject" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all appearance-none cursor-pointer">
                                        <option>Genel Bilgi Talebi</option>
                                        <option>Kredi Başvurusu Hakkında</option>
                                        <option>Ödeme ve Borç Sorgulama</option>
                                        <option>Şikayet ve Öneri</option>
                                        <option>Diğer</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-slate-300 ml-1">Mesajınız</label>
                                    <textarea 
                                      rows={5}
                                      id="message"
                                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none"
                                      placeholder="Mesajınızı buraya yazınız..."
                                    ></textarea>
                                </div>

                                {/* Burada form submit işlemi JS ile yapılmadığı için, submit handler eklemedim. */}
                                <button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.01] hover:shadow-indigo-500/40 flex items-center justify-center gap-2">
                                    <Send size={20} />
                                    Mesajı Gönder
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>

            {/* HARİTA BÖLÜMÜ (Opsiyonel - Görsellik için placeholder) */}
            <div className="mt-12 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative h-[400px] bg-slate-900 group">
                <div className="absolute inset-0 bg-slate-800/50 flex items-center justify-center group-hover:bg-slate-800/40 transition-colors">
                    <div className="text-center">
                        <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">Google Maps Harita Alanı</p>
                        <p className="text-slate-600 text-sm mt-2">Buraya Google Maps Iframe kodunuzu ekleyebilirsiniz.</p>
                    </div>
                </div>
                {/* Gerçek harita eklendiğinde üstteki div kaldırılıp iframe buraya konulacak */}
                {/* <iframe src="..." className="w-full h-full border-0" allowFullScreen="" loading="lazy"></iframe> */}
            </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Iletisim;