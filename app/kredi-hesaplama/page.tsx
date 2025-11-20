"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar'; 
import Footer from '../../components/Footer'; 
import Link from 'next/link'; 
import { Calculator, RefreshCcw, Wallet, PieChart, Calendar, Info, CheckCircle, TrendingUp } from 'lucide-react';

// ⭐️ Hesaplama Sonuçları için Tip Tanımı
interface CalculationResults {
  installment: number;
  totalRepayment: number;
  totalInterest: number;
  totalDeductions: number;
  netAmount: number;
  breakdown: { bloke: number; bolge: number; masraf: number };
}

// ⭐️ Props tanımı (Şu an props yok ama gelecekte eklenebilir)
interface KrediHesaplamaProps {}


// Bileşen tipi olarak React.FC (Function Component) kullanıldı
const KrediHesaplama: React.FC<KrediHesaplamaProps> = () => {
  // --- State Tanımları (Tipler atandı) ---
  const [amount, setAmount] = useState<number>(500000); // Varsayılan Tutar
  const [term, setTerm] = useState<number>(24); // Varsayılan Vade
  const [frequency, setFrequency] = useState<number>(2); // Varsayılan Ödeme Sıklığı (3 Aylık)
  
  // Hesaplama sonuçları için CalculationResults tipini kullan
  const [results, setResults] = useState<CalculationResults>({
    installment: 0,
    totalRepayment: 0,
    totalInterest: 0,
    totalDeductions: 0,
    netAmount: 0,
    breakdown: { bloke: 0, bolge: 0, masraf: 0 }
  });

  // Sabit Oranlar (Önceki sayfalardan alınan veriler)
  const INTEREST_RATE_ANNUAL: number = 0.25; // %25 Yıllık Faiz
  const DEDUCTION_RATES: { bloke: number, bolge: number, masraf: number } = {
    bloke: 0.015, // %1.5
    bolge: 0.0025, // %0.25
    masraf: 0.0125 // %1.25
  };

  // --- Hesaplama Fonksiyonu (Basitleştirilmiş Anüite Yaklaşımı) ---
  useEffect(() => {
    // Kesinti Hesaplamaları
    const bloke: number = amount * DEDUCTION_RATES.bloke;
    const bolge: number = amount * DEDUCTION_RATES.bolge;
    const masraf: number = amount * DEDUCTION_RATES.masraf;
    const totalDeductions: number = bloke + bolge + masraf;
    const netAmount: number = amount - totalDeductions;

    // Taksit Hesaplama
    const periodicRate: number = (INTEREST_RATE_ANNUAL / 12); // Aylık Faiz Oranı
    const actualPeriodicRate: number = periodicRate * frequency; // Seçilen periyoda göre dönemsel faiz oranı

    const numberOfInstallments: number = Math.ceil(term / frequency); // Taksit Sayısı

    let installment: number = 0;
    if (actualPeriodicRate > 0 && numberOfInstallments > 0) {
        // Anüite Formülü: A = P * [ i * (1 + i)^n ] / [ (1 + i)^n – 1 ]
        // i = Dönemsel Faiz Oranı, n = Taksit Sayısı, P = Anapara (amount)
        installment = amount * (actualPeriodicRate * Math.pow(1 + actualPeriodicRate, numberOfInstallments)) / (Math.pow(1 + actualPeriodicRate, numberOfInstallments) - 1);
    } else {
        // Sıfır faiz (veya hata durumunda)
        installment = amount / numberOfInstallments;
    }


    const totalRepayment: number = installment * numberOfInstallments;
    const totalInterest: number = totalRepayment - amount;

    setResults({
        installment: isNaN(installment) ? 0 : installment,
        totalRepayment: isNaN(totalRepayment) ? 0 : totalRepayment,
        totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
        totalDeductions: isNaN(totalDeductions) ? 0 : totalDeductions,
        netAmount: isNaN(netAmount) ? 0 : netAmount,
        breakdown: { bloke, bolge, masraf }
    });
  }, [amount, term, frequency]);

  // Para Formatlama Yardımcısı
  const formatMoney = (val: number): string => { // Tip ataması yapıldı
    if (isNaN(val) || val === Infinity) return '0 ₺';
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);
  };

  const getVadeText = (): string => { // Dönüş tipi string olarak belirlendi
    const years: number = Math.floor(term / 12);
    const months: number = term % 12;
    if (years > 0 && months > 0) return `${years} Yıl ${months} Ay`;
    if (years > 0) return `${years} Yıl`;
    return `${months} Ay`;
  };


  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 flex flex-col">
      <Navbar />
      
      {/* Ana Kapsayıcı */}
      <main className="flex-grow relative overflow-hidden">
        
        {/* --- GLOBAL ARKA PLAN EFEKTLERİ --- */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-screen"></div>
            <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-900/15 rounded-full blur-[150px] mix-blend-screen"></div>
        </div>

        {/* --- BAŞLIK BÖLÜMÜ --- */}
        <div className="relative z-10 pt-20 pb-12 lg:pt-24 lg:pb-16 text-center">
            <div className="container mx-auto px-4">
                <div className="inline-flex items-center justify-center space-x-3 mb-4 opacity-90">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-emerald-400"></div>
                    <span className="text-emerald-400 font-bold tracking-[0.25em] uppercase text-xs md:text-sm">HESAPLAMA ARACI</span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-emerald-400"></div>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl">
                  Kredi <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-blue-500">Hesaplama</span>
                </h1>
                
                <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
                  İhtiyacınız olan tutarı ve vadeyi belirleyin, tahmini geri ödeme planınızı anında oluşturun.
                </p>
                
                <div className="mt-12 w-full max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
            </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            
            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* --- SOL KOLON: HESAPLAMA FORMU (5 Birim) --- */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                        {/* Dekoratif Işık */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500"></div>

                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-emerald-400" />
                            Kredi Parametreleri
                        </h3>

                        {/* 1. Kredi Tutarı */}
                        <div className="mb-8">
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-300">Kredi Tutarı</label>
                                <span className="text-sm font-bold text-emerald-400">{formatMoney(amount)}</span>
                            </div>
                            <input 
                                type="range" 
                                min="10000" max="1000000" step="5000" 
                                value={amount} 
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
                            />
                            <div className="flex justify-between mt-2 text-xs text-slate-500">
                                <span>10.000 ₺</span>
                                <span>1.000.000 ₺</span>
                            </div>
                        </div>

                        {/* 2. Vade */}
                        <div className="mb-8">
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-300">Vade (Ay)</label>
                                <span className="text-sm font-bold text-blue-400">{term} Ay</span>
                            </div>
                            <input 
                                type="range" 
                                min="6" max="60" step="6" 
                                value={term} 
                                onChange={(e) => setTerm(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                            />
                            <div className="flex justify-between mt-2 text-xs text-slate-500">
                                <span>6 Ay</span>
                                <span>60 Ay</span>
                            </div>
                        </div>

                        {/* 3. Ödeme Sıklığı */}
                        <div className="mb-6">
                            <label className="text-sm font-medium text-slate-300 mb-3 block">Ödeme Sıklığı</label>
                            <div className="grid grid-cols-3 gap-3">
                                {/* Varsayılanı 1 olarak ayarladık */}
                                {[1, 3, 6].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => setFrequency(val)}
                                        className={`py-2.5 rounded-xl text-sm font-bold transition-all border ${
                                            frequency === val 
                                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/20' 
                                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                                        }`}
                                    >
                                        {val} Aylık
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Bilgi Notu */}
                        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-3">
                            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-200 leading-relaxed">
                                Hesaplama araçları bilgilendirme amaçlıdır. Kesin sonuçlar başvuru sırasında değişiklik gösterebilir.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- SAĞ KOLON: SONUÇLAR (7 Birim) --- */}
                <div className="lg:col-span-7 space-y-6">
                    
                    {/* Üst Kartlar: Taksit ve Toplam */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900/40 border border-emerald-500/30 p-6 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Calendar size={80} className="text-emerald-400" />
                            </div>
                            <p className="text-slate-400 text-sm mb-1 font-medium uppercase tracking-wide">Tahmini Taksit Tutarı ({Math.ceil(term / frequency)} Taksit)</p>
                            <h3 className="text-3xl font-extrabold text-white">{formatMoney(results.installment)}</h3>
                            <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 py-1 px-3 rounded-full w-fit">
                                <RefreshCcw size={12} />
                                Vade: {getVadeText()}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 border border-blue-500/30 p-6 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Wallet size={80} className="text-blue-400" />
                            </div>
                            <p className="text-slate-400 text-sm mb-1 font-medium uppercase tracking-wide">Ele Geçen Net Tutar</p>
                            <h3 className="text-3xl font-extrabold text-white">{formatMoney(results.netAmount)}</h3>
                            <div className="mt-4 flex items-center gap-2 text-blue-400 text-xs font-bold bg-blue-500/10 py-1 px-3 rounded-full w-fit">
                                <Info size={12} />
                                Kesintiler Düşülmüştür
                            </div>
                        </div>
                    </div>

                    {/* Detaylı Tablo */}
                    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8">
                        <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-700 pb-4">
                            <PieChart className="w-5 h-5 text-slate-400" />
                            Hesaplama Detayları
                        </h4>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Kredi Tutarı (Brüt)</span>
                                <span className="text-white font-bold">{formatMoney(amount)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Toplam Geri Ödeme</span>
                                <span className="text-white font-bold">{formatMoney(results.totalRepayment)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Toplam Faiz Tutarı</span>
                                <span className="text-emerald-400 font-bold">+ {formatMoney(results.totalInterest)}</span>
                            </div>
                            
                            <div className="border-t border-slate-700/50 my-4"></div>
                            
                            <div className="bg-slate-900/50 rounded-xl p-4 space-y-3">
                                <p className="text-xs text-slate-500 font-bold uppercase mb-2">Kesinti Dökümü</p>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                        Bloke Sermaye (%1.5)
                                    </span>
                                    <span className="text-slate-200">{formatMoney(results.breakdown.bloke)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                        Masraf Karşılığı (%1.25)
                                    </span>
                                    <span className="text-slate-200">{formatMoney(results.breakdown.masraf)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                                        Bölge Birliği Payı (%0.25)
                                    </span>
                                    <span className="text-slate-200">{formatMoney(results.breakdown.bolge)}</span>
                                </div>
                                <div className="border-t border-slate-700 pt-2 mt-2 flex justify-between items-center text-sm font-bold">
                                    <span className="text-slate-300">Toplam Kesinti</span>
                                    <span className="text-red-400">- {formatMoney(results.totalDeductions)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ⭐️ BU SATIR EKLENMELİYDİ (JavaScript'teki orijinal dosyanızda da vardı)
export default KrediHesaplama;