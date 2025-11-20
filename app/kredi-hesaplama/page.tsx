"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar'; 
import Footer from '../../components/Footer'; 
import Link from 'next/link'; 
import { Calculator, RefreshCcw, Wallet, PieChart, Calendar, Info, CheckCircle, TrendingUp, Briefcase, Building2, Truck } from 'lucide-react';

// ⭐️ Hesaplama Sonuçları için Tip Tanımı
interface CalculationResults {
  installment: number;
  totalRepayment: number;
  totalInterest: number;
  totalDeductions: number;
  netAmount: number;
  breakdown: { bloke: number; bolge: number; masraf: number };
}

// ⭐️ Kredi Türü Tipleri (Genişletildi)
type CreditType = 'business' | 'building' | 'vehicle'; 

// ⭐️ Props tanımı (Şu an props yok ama gelecekte eklenebilir)
interface KrediHesaplamaProps {}

// Sabit Faiz Oranı Tanımı
const INTEREST_RATE_ANNUAL: number = 0.25; // %25 Yıllık Faiz (Tüm kredi tipleri için sabit)
const INTEREST_RATE_DISPLAY: string = (INTEREST_RATE_ANNUAL * 100).toFixed(2); // Görüntülemek için

// Kredi Tutarı Limitleri Tanımı
const MIN_AMOUNT = 0; 
const BUSINESS_MAX_AMOUNT = 1000000; // İşletme Kredisi Maksimum Tutar
const BUILDING_MAX_AMOUNT = 2500000; // İşyeri Edindirme Maksimum Tutar (2.5 Milyon)
const VEHICLE_MAX_AMOUNT = 2500000; // Taşıt Edindirme Maksimum Tutar (2.5 Milyon)

// Vade Limitleri Tanımı
const MIN_TERM = 12; // Minimum vade 12 ay
const BUSINESS_MAX_TERM = 48; // İşletme Kredisi Maksimum Vade (4 Yıl)
const BUILDING_MAX_TERM = 60; // İşyeri Edindirme Maksimum Vade (5 Yıl)
const VEHICLE_MAX_TERM = 48; // Taşıt Edindirme Maksimum Vade 48 Ay oldu (4 Yıl)
const YEARLY_STEP = 12; // Yıllık Adım (Yeni kuralın anahtarı)

// Sabit Kesinti Oranları
const DEDUCTION_RATES: { bloke: number, bolge: number, masraf: number } = {
  bloke: 0.015, // %1.5
  bolge: 0.0025, // %0.25
  masraf: 0.0125 // %1.25
};

// Bileşen tipi olarak React.FC (Function Component) kullanıldı
const KrediHesaplama: React.FC<KrediHesaplamaProps> = () => {
  // --- State Tanımları (Tipler atandı) ---
  const [amount, setAmount] = useState<number>(500000); 
  const [term, setTerm] = useState<number>(24); 
  const [frequency, setFrequency] = useState<number>(1); // Varsayılan Ödeme Sıklığı 1 (Aylık)
  const [creditType, setCreditType] = useState<CreditType>('business'); // Varsayılan İşletme Kredisi
  
  // Hesaplama sonuçları için CalculationResults tipini kullan
  const [results, setResults] = useState<CalculationResults>({
    installment: 0,
    totalRepayment: 0,
    totalInterest: 0,
    totalDeductions: 0,
    netAmount: 0,
    breakdown: { bloke: 0, bolge: 0, masraf: 0 }
  });

  // Dinamik Maksimum Tutar Hesaplama
  const maxAmount: number = ((): number => {
    switch (creditType) {
        case 'business':
            return BUSINESS_MAX_AMOUNT;
        case 'building':
            return BUILDING_MAX_AMOUNT;
        case 'vehicle':
            return VEHICLE_MAX_AMOUNT;
        default:
            return BUSINESS_MAX_AMOUNT;
    }
  })();
  const rangeStep: number = creditType === 'business' ? 5000 : 25000; 

  // Dinamik Maksimum Vade Hesaplama
  const maxTerm: number = ((): number => {
    switch (creditType) {
        case 'business':
            return BUSINESS_MAX_TERM; // 48 Ay
        case 'building':
            return BUILDING_MAX_TERM; // 60 Ay
        case 'vehicle':
            return VEHICLE_MAX_TERM; // 48 Ay
        default:
            return BUSINESS_MAX_TERM;
    }
  })();

  // ⭐️ Vade ve Limit Kısıtlama Mantığı (UI'dan gelen değerleri temizlemek ve limitleri uygulamak için)
  useEffect(() => {
    // 1. Kredi Tutarı Limiti Kontrolü
    if (amount > maxAmount) {
      setAmount(maxAmount);
    } 
    
    // 2. Vade Limiti Kontrolü ve Yıllık Katlara Yuvarlama
    
    // A) Vade Sınırlarını Kontrol Et ve Düzelt
    let newTerm = term;
    if (newTerm < MIN_TERM) {
        newTerm = MIN_TERM;
    } else if (newTerm > maxTerm) {
        newTerm = maxTerm;
    }
    
    // B) Yıllık Katlara (12 Ay) Yuvarlama Mantığı (Step 12 olduğu için UI'da ara değerler seçilemez, bu sadece klavye girişi veya kredi türü değişimi için önemlidir)
    const roundedTerm = Math.round(newTerm / YEARLY_STEP) * YEARLY_STEP;
    
    let finalTerm = roundedTerm;
    
    // Yuvarlanmış değerin MIN ve MAX arasında olduğundan emin ol
    finalTerm = Math.max(MIN_TERM, Math.min(maxTerm, finalTerm));
    
    // C) Son Kontrol: Eğer yuvarlama, mevcut 'term' değerini değiştirdiyse, state'i güncelle.
    if (finalTerm !== term) {
        setTerm(finalTerm);
    }
    
  }, [creditType, maxAmount, amount, term, maxTerm]); 


  // --- Klavye Girişini Yönetme Fonksiyonu ---
  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Sadece sayıları al, binlik ayraçları kaldır
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    
    // Geçici olarak değeri numericValue'ye ata
    let numericValue = rawValue === '' ? 0 : Number(rawValue); // Boşsa 0 olarak ayarla

    // Limit kontrolü
    if (numericValue < MIN_AMOUNT) {
      numericValue = MIN_AMOUNT;
    } else if (numericValue > maxAmount) {
      numericValue = maxAmount;
    }
    
    // State'i güncelle
    setAmount(numericValue);

  }, [maxAmount]);
  

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
    } else if (numberOfInstallments > 0) {
        // Sıfır faiz durumu (veya hata durumunda)
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
    // Virgül (,) yerine nokta (.) kullanmıyorum.
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);
  };
  
  // Girdi kutusu için sadece rakamları formatlayan yardımcı fonksiyon
  const formatNumberInput = (val: number): string => {
    // Rakamları gruplayıp (binlik ayraç), '₺' sembolü olmadan döndürür
    // Eğer değer 0 ise, boş bir string döndürmek, kullanıcının sıfırdan giriş yapmaya başlamasını kolaylaştırır.
    if (val === 0) return '';
    return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(val);
  };


  // ⭐️ YENİ: Vade kaydırıcısının üzerindeki taksit sayısını gösterir (Periyot Sayısı)
  const getDisplayTerm = (): number => {
      // term (ay) / frequency (periyot) = periyot sayısı (taksit)
      return Math.ceil(term / frequency);
  };
  
  // Taksit sayısını/vade yılını gösteren metin (Örn: 2 Yıl)
  const getVadeText = (): string => { 
    const years: number = Math.floor(term / 12);
    
    if (years > 0) {
      // Vade hep yıllık katlar olduğu için, tam yıl gösterimi yeterli olacaktır.
      return `${years} Yıl`;
    }
    // Normalde buraya düşülmez (MIN_TERM = 12 olduğu için), ama yedek olarak duruyor.
    return `${term} Taksit`;
  };

  // Bilgi metninde kullanılacak maksimum vade tanımı
  const getMaxVadeText = (): string => {
    if (creditType === 'building') {
        return `İşyeri Edindirme Kredisi için ${BUILDING_MAX_TERM} Taksit (5 yıl)`;
    }
    // İşletme ve Taşıt için ortak metin
    return `İşletme ve Taşıt Edindirme Kredileri için ${BUSINESS_MAX_TERM} Taksit (4 yıl)`;
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
                        
                        {/* 0. Kredi Türü Seçimi (3'lü Grid) */}
                        <div className="mb-8">
                            <label className="text-sm font-medium text-slate-300 mb-3 block">Kredi Türü ({INTEREST_RATE_DISPLAY} % Yıllık Faiz Sabit)</label>
                            <div className="grid grid-cols-3 gap-3">
                                {/* İşletme Kredisi */}
                                <button
                                    onClick={() => setCreditType('business')}
                                    className={`py-3 px-1 rounded-xl text-xs sm:text-sm font-bold transition-all border flex flex-col items-center justify-center gap-1.5 ${
                                        creditType === 'business' 
                                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/20' 
                                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                                    }`}
                                >
                                    <Briefcase size={16} /> İşletme
                                </button>
                                {/* İşyeri Edindirme Kredisi */}
                                <button
                                    onClick={() => setCreditType('building')}
                                    className={`py-3 px-1 rounded-xl text-xs sm:text-sm font-bold transition-all border flex flex-col items-center justify-center gap-1.5 ${
                                        creditType === 'building' 
                                        ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/20' 
                                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                                    }`}
                                >
                                    <Building2 size={16} /> İşyeri
                                </button>
                                {/* Taşıt Edindirme Kredisi */}
                                <button
                                    onClick={() => setCreditType('vehicle')}
                                    className={`py-3 px-1 rounded-xl text-xs sm:text-sm font-bold transition-all border flex flex-col items-center justify-center gap-1.5 ${
                                        creditType === 'vehicle' 
                                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-900/20' 
                                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                                    }`}
                                >
                                    <Truck size={16} /> Taşıt
                                </button>
                            </div>
                        </div>


                        {/* 1. Kredi Tutarı */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-slate-300">Kredi Tutarı</label>
                                {/* Klavye ile giriş yapılan alanın düzeltilmiş yapısı */}
                                <div className="relative w-40">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={formatNumberInput(amount)}
                                        onChange={handleAmountChange}
                                        onBlur={(e) => {
                                            // onBlur'da boş ise 0'a çekilir.
                                            const rawValue = Number(e.target.value.replace(/[^0-9]/g, ''));
                                            if (rawValue === 0) {
                                                setAmount(0);
                                            }
                                        }}
                                        // Giriş alanının padding'ini ve font stilini ayarlayarak sembol için yer açtık
                                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-2 pr-7 py-1.5 text-sm font-bold text-emerald-400 text-right focus:outline-none focus:border-emerald-500/50"
                                    />
                                    {/* Sembolü giriş alanının içine, metinle çakışmayacak şekilde konumlandırdık */}
                                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none text-sm">₺</span>
                                </div>
                            </div>
                            
                            {/* Range input'u */}
                            <input 
                                type="range" 
                                min={MIN_AMOUNT} // Artık 0
                                max={maxAmount} // Dinamik maksimum tutar
                                step={rangeStep} // Dinamik adım
                                value={amount} 
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
                            />
                            <div className="flex justify-between mt-2 text-xs text-slate-500">
                                <span>{formatMoney(MIN_AMOUNT)}</span> {/* Görüntüleme 0 ₺ oldu */}
                                <span className="text-emerald-300 font-medium">{formatMoney(maxAmount)}</span> {/* Dinamik maksimum limit gösterimi */}
                            </div>
                        </div>

                        {/* 2. Vade */}
                        <div className="mb-8">
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-300">Vade (Taksit)</label>
                                <span className="text-sm font-bold text-blue-400">{getDisplayTerm()} Taksit</span> {/* ⭐️ GÜNCEL: Dinamik Taksit Sayısı */}
                            </div>
                            <input 
                                type="range" 
                                min={MIN_TERM} // Minimum 12 ay
                                max={maxTerm} // Dinamik maksimum vade
                                step={YEARLY_STEP} // Adımı doğrudan 12'ye ayarladık.
                                value={term} 
                                onChange={(e) => { 
                                    // Step 12 olduğu için aradaki değerler seçilemeyecek.
                                    setTerm(Number(e.target.value)); 
                                }}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                            />
                            <div className="flex justify-between mt-2 text-xs text-slate-500">
                                <span>{Math.ceil(MIN_TERM / frequency)} Taksit</span> {/* ⭐️ GÜNCEL: Minimum Taksit Periyodu */}
                                <span className="text-blue-300 font-medium">{Math.ceil(maxTerm / frequency)} Taksit</span> {/* ⭐️ GÜNCEL: Maksimum Taksit Periyodu */}
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
                                        {val === 1 ? 'Aylık' : `${val} Aylık`}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Bilgi Notu */}
                        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-3">
                            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-200 leading-relaxed">
                                Hesaplama araçları bilgilendirme amaçlıdır. Kesin sonuçlar başvuru sırasında değişiklik gösterebilir.
                                <br/>
                                <span className="font-semibold mt-1 block">Maksimum Kredi Tutarı:</span> İşletme Kredisi için {formatMoney(BUSINESS_MAX_AMOUNT)}, İşyeri Edindirme ve Taşıt Edindirme Kredileri için {formatMoney(BUILDING_MAX_AMOUNT)}'dir.
                                <span className="font-semibold mt-1 block">Maksimum Kredi Vadesi:</span> {getMaxVadeText()}.
                                <span className="font-semibold mt-1 block">Vade Seçimi:</span> Seçilen ödeme sıklığı ne olursa olsun, vade yalnızca yıllık (12, 24, 36...) katlar halinde belirlenebilir.
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
                            <p className="text-slate-400 text-sm mb-1 font-medium uppercase tracking-wide">Tahmini Taksit Tutarı ({getDisplayTerm()} Taksit)</p>
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
                                <span className="text-slate-400">Toplam Faiz Tutarı ({INTEREST_RATE_DISPLAY} % Yıllık)</span>
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

export default KrediHesaplama;