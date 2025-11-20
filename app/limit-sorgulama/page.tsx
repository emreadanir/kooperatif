"use client";

import React, { useState } from 'react';
import Navbar from '../../components/Navbar'; 
import Footer from '../../components/Footer'; 
import { Search, CreditCard, TrendingUp, ShieldAlert, CheckCircle2, AlertCircle, Loader2, FileText, Briefcase, Barcode, Info } from 'lucide-react';
import Link from 'next/link';

// ⭐️ YENİ: NACE Verileri için Tip Tanımı
interface NaceData {
    MESLEK: string;
    NACE_KODU: string;
    NACE_TANIMI: string;
    UST_LIMIT_TL: number;
}

// --- NACE KODU VERİ SETİ (Tip uygulaması yapıldı) ---
const naceVerileri: NaceData[] = [
    { MESLEK: "Çiçekçilik", NACE_KODU: "11902", NACE_TANIMI: "Çiçek yetiştirilmesi (lale, kasımpatı, zambak, gül vb. ile bunların tohumları)", UST_LIMIT_TL: 600000 },
            { MESLEK: "Çiçekçilik", NACE_KODU: "462108", NACE_TANIMI: "Tohum (yağlı tohumlar hariç) toptan ticareti", UST_LIMIT_TL: 600000 },
            { MESLEK: "Çiçekçilik", NACE_KODU: "462201", NACE_TANIMI: "Çiçeklerin ve bitkilerin toptan ticareti", UST_LIMIT_TL: 600000 },
            { MESLEK: "Çiçekçilik", NACE_KODU: "477602", NACE_TANIMI: "Belirli bir mala tahsis edilmiş mağazalarda çiçek, bitki ve tohum perakende ticareti", UST_LIMIT_TL: 600000 },
            { MESLEK: "Çiçekçilik", NACE_KODU: "477826", NACE_TANIMI: "Yapma çiçek, yaprak ve meyveler ile mum perakende ticareti", UST_LIMIT_TL: 600000 },
            { MESLEK: "Yük taşımacılığını destekleyici faaliyetler", NACE_KODU: "521002", NACE_TANIMI: "Frigorifik depolama ve antrepoculuk faaliyetleri (bozulabilir gıda ürünleri dahil dondurulmuş veya soğutulmuş mallar için depolama)", UST_LIMIT_TL: 600000 },
            { MESLEK: "Yük taşımacılığını destekleyici faaliyetler", NACE_KODU: "521003", NACE_TANIMI: "Hububat depolama ve antrepoculuk faaliyetleri (hububat silolarının işletilmesi vb.)", UST_LIMIT_TL: 600000 },
            { MESLEK: "Yük taşımacılığını destekleyici faaliyetler", NACE_KODU: "521005", NACE_TANIMI: "Dökme sıvı depolama ve antrepoculuk faaliyetleri (yağ, şarap vb. dahil; petrol, petrol ürünleri, kimyasallar, gaz vb. hariç)", UST_LIMIT_TL: 600000 },
            { MESLEK: "Yük taşımacılığını destekleyici faaliyetler", NACE_KODU: "521090", NACE_TANIMI: "Diğer depolama ve antrepoculuk faaliyetleri (dökme sıvı ve gaz depolama faaliyetleri hariç)", UST_LIMIT_TL: 600000 },
            { MESLEK: "Yük taşımacılığını destekleyici faaliyetler", NACE_KODU: "522106", NACE_TANIMI: "Kara taşımacılığına yönelik yer ve güzergah işletmeciliği (demir yollarında yapılanlar dahil)", UST_LIMIT_TL: 550000 },
            { MESLEK: "Yük taşımacılığını destekleyici faaliyetler", NACE_KODU: "522408", NACE_TANIMI: "Su yolu taşımacılığıyla ilgili kargo ve bagaj yükleme boşaltma (elleçleme) hizmetleri", UST_LIMIT_TL: 550000 },
            { MESLEK: "Yük taşımacılığını destekleyici faaliyetler", NACE_KODU: "522410", NACE_TANIMI: "Kara yolu taşımacılığıyla ilgili kargo yükleme boşaltma (elleçleme) hizmetleri", UST_LIMIT_TL: 550000 },
            { MESLEK: "Yük taşımacılığını destekleyici faaliyetler", NACE_KODU: "522411", NACE_TANIMI: "Demir yolu taşımacılığıyla ilgili kargo yükleme boşaltma (elleçleme) hizmetleri", UST_LIMIT_TL: 550000 },
            { MESLEK: "Yük taşımacılığını destekleyici faaliyetler", NACE_KODU: "522599", NACE_TANIMI: "Başka yerde sınıflandırılmamış taşımacılığı destekleyici diğer faaliyetler (grup sevkiyatının organizasyonu, malların taşınması sırasında korunması için geçici olarak kasalara vb. yerleştirilmesi, yüklerin birleştirilmesi, gruplanması ve parçalara ayrılması, vb. dahil)", UST_LIMIT_TL: 550000 },
            { MESLEK: "Yük taşımacılığını destekleyici faaliyetler", NACE_KODU: "522699", NACE_TANIMI: "Başka yerde sınıflandırılmamış taşımacılığa yönelik diğer destekleyici faaliyetler", UST_LIMIT_TL: 550000 },
            { MESLEK: "Yük taşımacılığını destekleyici faaliyetler", NACE_KODU: "532008", NACE_TANIMI: "Gıda dağıtım faaliyetleri", UST_LIMIT_TL: 550000 },
            { MESLEK: "Yük taşımacılığını destekleyici faaliyetler", NACE_KODU: "532009", NACE_TANIMI: "Kurye faaliyetleri (kara, deniz ve hava yolu ile yapılanlar dahil; evrensel hizmet yükümlülüğü altında postacılık ile gıda dağıtım faaliyetleri hariç)", UST_LIMIT_TL: 550000 },
            { MESLEK: "Yük taşımacılığını destekleyici faaliyetler", NACE_KODU: "532010", NACE_TANIMI: "Paket ve koli gibi kargoların toplanması, sınıflandırılması, taşınması ve dağıtımı faaliyetleri (dökme yükler ve evrensel hizmet yükümlülüğü altında postacılık faaliyetleri hariç)", UST_LIMIT_TL: 550000 },
            { MESLEK: "Yük taşımacılığını destekleyici faaliyetler", NACE_KODU: "691010", NACE_TANIMI: "Yediemin faaliyetleri", UST_LIMIT_TL: 550000 },
            { MESLEK: "Yük taşımacılığını destekleyici faaliyetler", NACE_KODU: "731103", NACE_TANIMI: "Reklam araç ve eşantiyonların dağıtımı ve teslimi faaliyetleri", UST_LIMIT_TL: 550000 },
            { MESLEK: "Yük taşımacılığını destekleyici faaliyetler", NACE_KODU: "829201", NACE_TANIMI: "Tehlikeli ürünleri paketleme faaliyetleri", UST_LIMIT_TL: 550000 },
            { MESLEK: "Yük taşımacılığını destekleyici faaliyetler", NACE_KODU: "829205", NACE_TANIMI: "Tehlikesiz ürünleri paketleme faaliyetleri", UST_LIMIT_TL: 550000 },
            { MESLEK: "Yük taşımacılığını destekleyici faaliyetler", NACE_KODU: "969902", NACE_TANIMI: "Hamallık hizmetleri", UST_LIMIT_TL: 550000 },
            { MESLEK: "Çamaşırhane, kuru temizleme, ütücülük hizmetleri", NACE_KODU: "961002", NACE_TANIMI: "Çamaşırhane hizmetleri", UST_LIMIT_TL: 575000 },
            { MESLEK: "Çamaşırhane, kuru temizleme, ütücülük hizmetleri", NACE_KODU: "961003", NACE_TANIMI: "Kuru temizleme hizmetleri", UST_LIMIT_TL: 575000 },
            { MESLEK: "Çamaşırhane, kuru temizleme, ütücülük hizmetleri", NACE_KODU: "961001", NACE_TANIMI: "Giyim eşyası ve diğer tekstil ürünlerini ütüleme hizmetleri", UST_LIMIT_TL: 500000 },
            { MESLEK: "Halı yıkama hizmetleri", NACE_KODU: "961004", NACE_TANIMI: "Halı ve kilim yıkama hizmetleri", UST_LIMIT_TL: 600000 },
            { MESLEK: "Börekçilik", NACE_KODU: "561107", NACE_TANIMI: "Böreklerin faaliyetleri (imalatların faaliyetleri ile seyyar olanlar hariç)", UST_LIMIT_TL: 600000 },
            { MESLEK: "Kahvehanecilik, kıraathanecilik", NACE_KODU: "563090", NACE_TANIMI: "Seyyar içecek satanlar ile diğer içecek sunum faaliyetleri (alkollü-alkolsüz dahil)", UST_LIMIT_TL: 600000 },
            { MESLEK: "Yufkacılık, kadayıfçılık", NACE_KODU: "107203", NACE_TANIMI: "Taze pastane ürünleri imalatı (taze kek, pasta, turta, tart, vb.) (pişirilmiş olsun olmasın tatlandırılmamış kadayıf, baklava vb. yufka imalatı dahil)", UST_LIMIT_TL: 600000 },
            { MESLEK: "Ajans, organizasyon faaliyetleri", NACE_KODU: "823002", NACE_TANIMI: "Kongre ve ticari gösteri organizasyonu", UST_LIMIT_TL: 500000 },
            { MESLEK: "Ajans, organizasyon faaliyetleri", NACE_KODU: "749901", NACE_TANIMI: "Sanatçı, sporcu, şovmen, manken ve diğerleri için ajansların ve menajerlerin faaliyetleri", UST_LIMIT_TL: 500000 },
            { MESLEK: "Ajans, organizasyon faaliyetleri", NACE_KODU: "773999", NACE_TANIMI: "Başka yerde sınıflandırılmamış diğer makine ve ekipmanların sürücüsüz kiralanması ve leasingi ile maden çıkarma makinelerinin operatörsüz leasingi", UST_LIMIT_TL: 500000 },
            { MESLEK: "Ajans, organizasyon faaliyetleri", NACE_KODU: "781004", NACE_TANIMI: "Oyuncu seçme ajansları ve bürolarının faaliyetleri", UST_LIMIT_TL: 500000 },
            { MESLEK: "Ajans, organizasyon faaliyetleri", NACE_KODU: "799099", NACE_TANIMI: "Başka yerde sınıflandırılmamış diğer rezervasyon hizmetleri ve ilgili faaliyetler (turizm tanıtım faaliyetleri, vb.)", UST_LIMIT_TL: 500000 },
            { MESLEK: "Ajans, organizasyon faaliyetleri", NACE_KODU: "824001", NACE_TANIMI: "Spor, müzik, tiyatro ve diğer eğlence etkinlikleri için yer ayırma (rezervasyon) ve bilet satılması faaliyeti", UST_LIMIT_TL: 500000 },
            { MESLEK: "Ajans, organizasyon faaliyetleri", NACE_KODU: "902001", NACE_TANIMI: "Bağımsız aktör, aktrist ve dublörlerin faaliyetleri", UST_LIMIT_TL: 500000 },
            { MESLEK: "Ajans, organizasyon faaliyetleri", NACE_KODU: "903990", NACE_TANIMI: "Sanat ve gösteri sanatlarına yönelik diğer destek faaliyetleri (sanat ve gösteri sanatlarına yönelik yönetmenlerin ve yapımcıların faaliyetleri hariç)", UST_LIMIT_TL: 500000 },
            { MESLEK: "Ajans, organizasyon faaliyetleri", NACE_KODU: "931902", NACE_TANIMI: "Spor etkinliklerinin faaliyetleri ile bu etkinlikleri kendileri için tesissiz olmayan kuruluşlar tarafından düzenlenmesi faaliyetleri (spor kulüpleri tarafından yapılanlar hariç)", UST_LIMIT_TL: 500000 },
            { MESLEK: "Oto lastik onarımı", NACE_KODU: "221119", NACE_TANIMI: "Lastik tekerleklerinin yeniden işlenmesi ve sırt geçirilmesi (lastiğin kaplanması)", UST_LIMIT_TL: 550000 },
            { MESLEK: "Oto lastik onarımı", NACE_KODU: "953102", NACE_TANIMI: "Motorlu kara taşıtlarının lastik onarımı faaliyetleri", UST_LIMIT_TL: 550000 },
            { MESLEK: "Oto yıkama, yağlama", NACE_KODU: "953103", NACE_TANIMI: "Motorlu kara taşıtlarının yağlama, yıkama, cilalama vb. faaliyetleri", UST_LIMIT_TL: 550000 },
            { MESLEK: "Çilingirlik", NACE_KODU: "256204", NACE_TANIMI: "Kilit ve menteşe imalatı", UST_LIMIT_TL: 550000 },
            { MESLEK: "Çilingirlik", NACE_KODU: "952904", NACE_TANIMI: "Anahtar çoğaltma hizmetleri", UST_LIMIT_TL: 450000 },
            { MESLEK: "Evcil hayvan bakımı, ticareti", NACE_KODU: "109101", NACE_TANIMI: "Çiftlik hayvanları için hazır yem imalatı", UST_LIMIT_TL: 550000 },
            { MESLEK: "Evcil hayvan bakımı, ticareti", NACE_KODU: "109201", NACE_TANIMI: "Ev hayvanları için hazır gıda imalatı (kedi ve köpek mamaları, kuş ve balık yemleri vb.)", UST_LIMIT_TL: 550000 },
            { MESLEK: "Evcil hayvan bakımı, ticareti", NACE_KODU: "462101", NACE_TANIMI: "Hayvan yemi toptan ticareti", UST_LIMIT_TL: 550000 },
            { MESLEK: "Evcil hayvan bakımı, ticareti", NACE_KODU: "463802", NACE_TANIMI: "Ev hayvanları için yemlerin veya yiyeceklerin toptan ticareti (çiftlik hayvanları için olanlar hariç)", UST_LIMIT_TL: 550000 },
            { MESLEK: "Evcil hayvan bakımı, ticareti", NACE_KODU: "14803", NACE_TANIMI: "Evcil hayvanların yetiştirilmesi ve üretilmesi (balık hariç) (kedi, köpek, kuşlar, hamsterlar vb.)", UST_LIMIT_TL: 450000 },
            { MESLEK: "Evcil hayvan bakımı, ticareti", NACE_KODU: "477601", NACE_TANIMI: "Ev hayvanları, bunların mama ve gıdaları ile eşyalarının perakende ticareti", UST_LIMIT_TL: 450000 },
            { MESLEK: "Evcil hayvan bakımı, ticareti", NACE_KODU: "969904", NACE_TANIMI: "Ev hayvanları ve terk edilmiş hayvanlar için bakım hizmetleri", UST_LIMIT_TL: 450000 },
            { MESLEK: "Bireysel sanatkârlık faaliyetleri", NACE_KODU: "901300", NACE_TANIMI: "Diğer sanatsal yaratıcılık faaliyetleri", UST_LIMIT_TL: 550000 },
            { MESLEK: "Hasta bakıcılığı", NACE_KODU: "869401", NACE_TANIMI: "Ebe, sağlık memuru, sünnetçi, iğneci, pansumancı vb.leri tarafından verilen hizmetler (tıp doktorları dışında)", UST_LIMIT_TL: 500000 },
            { MESLEK: "Hasta bakıcılığı", NACE_KODU: "869402", NACE_TANIMI: "Hemşirelik hizmetleri (evdeki hastalar için bakım, koruma, anne bakımı, çocuk sağlığı ve hemşirelik bakımı alanındaki benzeri hizmetler dahil; hemşireli yatılı bakım tesislerinin faaliyetleri ile tıp doktorlarının hizmetleri hariç)", UST_LIMIT_TL: 500000 },
            { MESLEK: "Hasta bakıcılığı", NACE_KODU: "871001", NACE_TANIMI: "Hemşireli yatılı bakım faaliyetleri", UST_LIMIT_TL: 500000 },
            { MESLEK: "Hasta bakıcılığı", NACE_KODU: "872002", NACE_TANIMI: "Zihinsel engellilik, ruhsal bozukluk ve madde bağımlılığı olan kişilere yönelik yatılı bakım faaliyetleri (hastanelerin faaliyetleri ile yatılı sosyal hizmet faaliyetleri hariç)", UST_LIMIT_TL: 500000 },
            { MESLEK: "Hasta bakıcılığı", NACE_KODU: "873002", NACE_TANIMI: "Yaşlılara ve bedensel engellilere yönelik yatılı bakım faaliyetleri (destekli yaşam tesisleri, hemşire bakımı olmayan huzurevleri ve asgari düzeyde hemşire bakımı olan evlerin faaliyetleri dahil, yaşlılar için hemşire bakımlı evlerin faaliyetleri hariç)", UST_LIMIT_TL: 500000 },
            { MESLEK: "Hasta bakıcılığı", NACE_KODU: "881002", NACE_TANIMI: "Yaşlılar ve bedensel engelliler için barınacak yer sağlanmaksızın verilen sosyal hizmetler (yatılı bakım faaliyetleri ile engelli çocuklara yönelik gündüz bakım (kreş) faaliyetleri hariç)", UST_LIMIT_TL: 500000 },
            { MESLEK: "Hasta bakıcılığı", NACE_KODU: "889907", NACE_TANIMI: "Barınacak yer sağlanmaksızın çocuk ve gençlere yönelik rehabilitasyon hizmetleri (bedensel engelliler için rehabilitasyon hizmetleri hariç)", UST_LIMIT_TL: 500000 },
            { MESLEK: "Hasta bakıcılığı", NACE_KODU: "889909", NACE_TANIMI: "Barınacak yer sağlanmaksızın çocuk ve gençlere yönelik rehabilitasyon hizmetleri (zihinsel engelliler için olanlar dahil, bedensel engellilere yönelik olanlar hariç)", UST_LIMIT_TL: 500000 },
            { MESLEK: "Hasta bakıcılığı", NACE_KODU: "969901", NACE_TANIMI: "Eskort ve refakat hizmetleri (güvenlik hizmetleri hariç)", UST_LIMIT_TL: 500000 },
            { MESLEK: "İkinci el eşya ticareti", NACE_KODU: "477904", NACE_TANIMI: "Kullanılmış mobilya, elektrikli ve elektronik ev eşyası perakende ticareti", UST_LIMIT_TL: 550000 },
            { MESLEK: "İkinci el eşya ticareti", NACE_KODU: "477990", NACE_TANIMI: "Diğer ikinci el eşya perakende ticareti (ikinci el motorlu kara taşıtları ve motosiklet parçaları hariç)", UST_LIMIT_TL: 550000 },
            { MESLEK: "İkinci el eşya ticareti", NACE_KODU: "479200", NACE_TANIMI: "Uzmanlaşmamış perakende ticaret için aracılık hizmetleri", UST_LIMIT_TL: 550000 },
            { MESLEK: "İkinci el eşya ticareti", NACE_KODU: "772299", NACE_TANIMI: "Başka yerde sınıflandırılmamış diğer kiralama ve operasyonel leasing (müzik aletleri, giyim eşyası, mücevher vb. ile video kasetler, büro mobilyaları, eğlence ve spor ekipmanları hariç)", UST_LIMIT_TL: 550000 },
            { MESLEK: "İkinci el tekstil ürünleri ticareti", NACE_KODU: "477906", NACE_TANIMI: "Kullanılmış giysiler ve aksesuarların perakende ticareti", UST_LIMIT_TL: 500000 },
            { MESLEK: "Motosiklet, bisiklet imalatı, onarımı", NACE_KODU: "952905", NACE_TANIMI: "Bisiklet onarımı", UST_LIMIT_TL: 500000 },
            { MESLEK: "Oyun salonu, internet kafe işletmeciliği", NACE_KODU: "619005", NACE_TANIMI: "İnternet kafelerin faaliyetleri", UST_LIMIT_TL: 600000 },
            { MESLEK: "Oyun salonu, internet kafe işletmeciliği", NACE_KODU: "932903", NACE_TANIMI: "Oyun makinelerinin işletilmesi", UST_LIMIT_TL: 600000 },
            { MESLEK: "Oyun salonu, internet kafe işletmeciliği", NACE_KODU: "932908", NACE_TANIMI: "Bilardo salonlarının faaliyetleri", UST_LIMIT_TL: 600000 },
            { MESLEK: "Oyun salonu, internet kafe işletmeciliği", NACE_KODU: "932911", NACE_TANIMI: "Elektronik spor (e-spor) oyun merkezlerinin faaliyetleri", UST_LIMIT_TL: 600000 },
            { MESLEK: "Ses, sahne sanatçılığı", NACE_KODU: "902002", NACE_TANIMI: "Bağımsız müzisyen, ses sanatçısı, konuşmacı, sunucu vb.lerin faaliyetleri (müzik grupları dahil)", UST_LIMIT_TL: 500000 },
            { MESLEK: "Ses, sahne sanatçılığı", NACE_KODU: "902003", NACE_TANIMI: "Canlı tiyatro, opera, bale, müzikal, konser vb. yapımların sahneye konulması faaliyetleri (illüzyon gösterileri, kukla gösterileri ve kumpanyalar dahil)", UST_LIMIT_TL: 500000 },
            { MESLEK: "Ses, sahne sanatçılığı", NACE_KODU: "902099", NACE_TANIMI: "Başka yerde sınıflandırılmış diğer gösteri sanatları", UST_LIMIT_TL: 500000 },
            { MESLEK: "Seyyar satıcılık", NACE_KODU: "471104", NACE_TANIMI: "Mağaza, tezgah, pazar yeri dışında yapılan perakende ticaret (ev ve dolaşarak veya komisyoncular tarafından perakende olarak yapılanlar)", UST_LIMIT_TL: 600000 },
            { MESLEK: "Seyyar satıcılık", NACE_KODU: "471106", NACE_TANIMI: "Seyyar olarak ve motorlu araçlarla gıda ürünleri ve içeceklerin (alkollü içecekler hariç) perakende ticareti", UST_LIMIT_TL: 600000 },
            { MESLEK: "Seyyar satıcılık", NACE_KODU: "471202", NACE_TANIMI: "Seyyar olarak ve motorlu araçlarla diğer malların perakende ticareti", UST_LIMIT_TL: 600000 },
            { MESLEK: "Seyyar satıcılık", NACE_KODU: "475107", NACE_TANIMI: "Seyyar olarak ve motorlu araçlarla tekstil, giyim eşyası ve ayakkabı perakende ticareti", UST_LIMIT_TL: 600000 },
            { MESLEK: "Seyyar satıcılık", NACE_KODU: "561200", NACE_TANIMI: "Seyyar yemek hizmeti faaliyetleri", UST_LIMIT_TL: 600000 },
            { MESLEK: "Alternatif tedavi merkezi işletmeciliği", NACE_KODU: "869500", NACE_TANIMI: "Fizyoterapi hizmetleri", UST_LIMIT_TL: 500000 },
            { MESLEK: "Alternatif tedavi merkezi işletmeciliği", NACE_KODU: "869600", NACE_TANIMI: "Tıp doktorları dışında yetkili kişilerce sağlanan fizyoterapi, ergoterapi vb. alanlardaki hizmetleri (hastane dışı)", UST_LIMIT_TL: 500000 },
            { MESLEK: "Alternatif tedavi merkezi işletmeciliği", NACE_KODU: "869999", NACE_TANIMI: "Geleneksel, tamamlayıcı ve alternatif tıp faaliyetleri", UST_LIMIT_TL: 500000 },
            { MESLEK: "Cenaze hizmetleri", NACE_KODU: "963001", NACE_TANIMI: "Başka yerde sınıflandırılmamış diğer insan sağlığı faaliyetleri (kan merkezleri ile kan, sperm ve organ bankalarının faaliyetleri hariç)", UST_LIMIT_TL: 500000 },
            { MESLEK: "Eğlence yerleri işletmeciliği", NACE_KODU: "932999", NACE_TANIMI: "Başka yerde sınıflandırılmış diğer eğlence ve dinlence (rekreasyon) faaliyetleri", UST_LIMIT_TL: 500000 },
            { MESLEK: "Özel ambulans işletmeciliği", NACE_KODU: "869200", NACE_TANIMI: "Ambulansla hasta taşıma", UST_LIMIT_TL: 500000 },
            { MESLEK: "Tasarım faaliyetleri", NACE_KODU: "741400", NACE_TANIMI: "Diğer uzmanlaşmış tasarım faaliyetleri (endüstriyel ürün ve moda tasarımı, iç tasarım ve grafik tasarım faaliyetleri hariç)", UST_LIMIT_TL: 500000 },
            { MESLEK: "Telekomünikasyon cihazları onarımı", NACE_KODU: "422205", NACE_TANIMI: "Telekomünikasyon şebeke ve ağlarının bakım ve onarımı", UST_LIMIT_TL: 550000 },
            { MESLEK: "Telekomünikasyon cihazları onarımı", NACE_KODU: "951002", NACE_TANIMI: "İletişim araç ve gereçlerinin onarımı (kablosuz telefonlar, telsizler, cep telefonları, çağrı cihazları, ticari kameralar vb.)", UST_LIMIT_TL: 550000 },
            { MESLEK: "Bilgisayar kurulumu, onarımı, programlama, veri kurtarma", NACE_KODU: "182003", NACE_TANIMI: "Yazılımların çoğaltılması hizmetleri (CD, kaset vb. ortamlardaki bilgisayar yazılımlarının ve verilerin asıl (master) kopyalarından çoğaltılması)", UST_LIMIT_TL: 500000 },
            { MESLEK: "Bilgisayar kurulumu, onarımı, programlama, veri kurtarma", NACE_KODU: "582101", NACE_TANIMI: "Video oyunlarının yayımlanması", UST_LIMIT_TL: 500000 },
            { MESLEK: "Bilgisayar kurulumu, onarımı, programlama, veri kurtarma", NACE_KODU: "582901", NACE_TANIMI: "Diğer yazılım programlarının yayımlanması", UST_LIMIT_TL: 500000 },
            { MESLEK: "Bilgisayar kurulumu, onarımı, programlama, veri kurtarma", NACE_KODU: "621000", NACE_TANIMI: "Bilgisayar programlama faaliyetleri", UST_LIMIT_TL: 500000 },
            { MESLEK: "Bilgisayar kurulumu, onarımı, programlama, veri kurtarma", NACE_KODU: "622000", NACE_TANIMI: "Bilgisayar danışmanlığı ve bilgisayar birimleri (sistemleri) yönetimi faaliyetleri (über güvenlik danışmanlığı dahil)", UST_LIMIT_TL: 500000 },
            { MESLEK: "Bilgisayar kurulumu, onarımı, programlama, veri kurtarma", NACE_KODU: "629001", NACE_TANIMI: "Bilgisayarlaşan felaketleri kurtarma ve veri kurtarma faaliyetleri", UST_LIMIT_TL: 500000 },
            { MESLEK: "Bilgisayar kurulumu, onarımı, programlama, veri kurtarma", NACE_KODU: "629099", NACE_TANIMI: "Başka yerde sınıflandırılmamış diğer bilgi teknolojisi ve bilgisayar hizmet faaliyetleri", UST_LIMIT_TL: 500000 },
            { MESLEK: "Bilgisayar kurulumu, onarımı, programlama, veri kurtarma", NACE_KODU: "631000", NACE_TANIMI: "Bilgi işlem altyapısı, veri işleme, barındırma ve ilgili faaliyetler", UST_LIMIT_TL: 500000 },
            { MESLEK: "Bilgisayar kurulumu, onarımı, programlama, veri kurtarma", NACE_KODU: "639102", NACE_TANIMI: "Web arama portalı faaliyetleri", UST_LIMIT_TL: 500000 },
            { MESLEK: "Bilgisayar kurulumu, onarımı, programlama, veri kurtarma", NACE_KODU: "951001", NACE_TANIMI: "Bilgisayarların ve bilgisayar çevre birimlerinin onarımı (ATM'ler ve pos cihazları dahil)", UST_LIMIT_TL: 500000 },
            { MESLEK: "Arzuhalcilik, danışmanlık, bilgi hizmetleri", NACE_KODU: "639200", NACE_TANIMI: "Diğer bilgi hizmeti faaliyetleri", UST_LIMIT_TL: 400000 },
            { MESLEK: "Arzuhalcilik, danışmanlık, bilgi hizmetleri", NACE_KODU: "702001", NACE_TANIMI: "İşletme ve diğer idari danışmanlık faaliyetleri", UST_LIMIT_TL: 400000 },
            { MESLEK: "Arzuhalcilik, danışmanlık, bilgi hizmetleri", NACE_KODU: "702002", NACE_TANIMI: "İnsan kaynakları yönetim danışmanlığı faaliyetleri", UST_LIMIT_TL: 400000 },
            { MESLEK: "Arzuhalcilik, danışmanlık, bilgi hizmetleri", NACE_KODU: "749903", NACE_TANIMI: "İşyeri komisyonculuğu faaliyetleri (küçük ve orta ölçekli işletmelerin alım ve satımının düzenlenmesi vb.)", UST_LIMIT_TL: 400000 },
            { MESLEK: "Arzuhalcilik, danışmanlık, bilgi hizmetleri", NACE_KODU: "781001", NACE_TANIMI: "İş bulma acentelerinin faaliyetleri (işe girecek kişilerin seçimi ve yerleştirilmesi faaliyetleri dahil)", UST_LIMIT_TL: 400000 },
            { MESLEK: "Arzuhalcilik, danışmanlık, bilgi hizmetleri", NACE_KODU: "782002", NACE_TANIMI: "Geçici iş bulma acenteleri ile diğer insan kaynaklarının sağlanması faaliyetleri", UST_LIMIT_TL: 400000 },
            { MESLEK: "Arzuhalcilik, danışmanlık, bilgi hizmetleri", NACE_KODU: "821001", NACE_TANIMI: "Büro yönetimi ve destek faaliyetleri (sanal ofis, hazır ofis ve paylaşımlı ofis hariç)", UST_LIMIT_TL: 400000 },
            { MESLEK: "Arzuhalcilik, danışmanlık, bilgi hizmetleri", NACE_KODU: "822001", NACE_TANIMI: "Çağrı merkezlerinin faaliyetleri", UST_LIMIT_TL: 400000 },
            { MESLEK: "Arzuhalcilik, danışmanlık, bilgi hizmetleri", NACE_KODU: "829999", NACE_TANIMI: "Başka yerde sınıflandırılmamış diğer işletme destek hizmeti faaliyetleri", UST_LIMIT_TL: 400000 },
            { MESLEK: "Arzuhalcilik, danışmanlık, bilgi hizmetleri", NACE_KODU: "969908", NACE_TANIMI: "Arzuhalcilerin faaliyetleri", UST_LIMIT_TL: 400000 },
            { MESLEK: "Arzuhalcilik, danışmanlık, bilgi hizmetleri", NACE_KODU: "969913", NACE_TANIMI: "Secere bulma faaliyetleri", UST_LIMIT_TL: 400000 },
            { MESLEK: "Arzuhalcilik, danışmanlık, bilgi hizmetleri", NACE_KODU: "732003", NACE_TANIMI: "Piyasa ve kamuoyu araştırma faaliyetleri", UST_LIMIT_TL: 500000 },
            { MESLEK: "Fatura tahsilat bürosu işletmeciliği", NACE_KODU: "829100", NACE_TANIMI: "Tahsilat ve kredi kayıt bürolarının faaliyetleri", UST_LIMIT_TL: 375000 },
            { MESLEK: "Faytonculuk", NACE_KODU: "493900", NACE_TANIMI: "Başka yerde sınıflandırılmamış kara taşımacılığı ile yapılan diğer yolcu taşımacılığı", UST_LIMIT_TL: 450000 },
            { MESLEK: "Müzik aletleri imalatı, onarımı, ticareti", NACE_KODU: "772203", NACE_TANIMI: "Müzik aletlerinin kiralanması ve operasyonel leasingi", UST_LIMIT_TL: 400000 },
            { MESLEK: "Oto kurtarıcılık", NACE_KODU: "522104", NACE_TANIMI: "Kara yolu taşımacılığı ile ilgili özel ve ticari araçlar için çekme ve yol yardımı faaliyetleri", UST_LIMIT_TL: 450000 },
            { MESLEK: "Tercümanlık", NACE_KODU: "743012", NACE_TANIMI: "Tercüme ve sözlü tercüme faaliyetleri (işaret dili dahil)", UST_LIMIT_TL: 400000 },
            { MESLEK: "Tuvalet işletmeciliği", NACE_KODU: "969907", NACE_TANIMI: "Genel tuvaletlerin işletilmesi faaliyeti", UST_LIMIT_TL: 400000 },
            { MESLEK: "E-ticaret", NACE_KODU: "479114", NACE_TANIMI: "Radyo, TV, posta yoluyla veya İnternet üzerinden yapılan perakende ticaret", UST_LIMIT_TL: 300000 },
            { MESLEK: "Emlakçılık", NACE_KODU: "683101", NACE_TANIMI: "Gayrimenkul değerlendirme (ekspertizlik), danışmanlık ve emanet aracılarının (escrow) faaliyetleri", UST_LIMIT_TL: 350000 },
            { MESLEK: "Emlakçılık", NACE_KODU: "683201", NACE_TANIMI: "Gayrimenkul değerlendirme (ekspertizlik), danışmanlık ve emanet aracılarının (escrow) faaliyetleri", UST_LIMIT_TL: 350000 },
            { MESLEK: "Emlakçılık", NACE_KODU: "811001", NACE_TANIMI: "Tesis bünyesindeki kombine destek hizmetleri", UST_LIMIT_TL: 350000 },
            { MESLEK: "Oto galericilik, oto kiralama", NACE_KODU: "478114", NACE_TANIMI: "Otomobillerin ve hafif motorlu kara taşıtlarının perakende ticareti (elektrikli olanlar ile ambulans vb. minibüs benzeri motorlu yolcu taşıtları dahil)", UST_LIMIT_TL: 350000 },
            { MESLEK: "Oto galericilik, oto kiralama", NACE_KODU: "478190", NACE_TANIMI: "Diğer motorlu kara taşıtlarının perakende ticareti (kamyonlar, çekiciler, römorklar, yarı römorklar, kamp araçları vb., elektrikli olanlar dahil)", UST_LIMIT_TL: 350000 },
            { MESLEK: "Oto galericilik, oto kiralama", NACE_KODU: "493302", NACE_TANIMI: "Sürücüsü ile birlikte diğer özel araç kiralama faaliyeti", UST_LIMIT_TL: 350000 },
            { MESLEK: "Oto galericilik, oto kiralama", NACE_KODU: "771101", NACE_TANIMI: "Motorlu hafif kara taşıtlarının ve arabaların sürücüsüz olarak kiralanması ve operasyonel leasingi (motosiklet ve motokaravan için olanlar hariç)", UST_LIMIT_TL: 350000 },
            { MESLEK: "Oto galericilik, oto kiralama", NACE_KODU: "771201", NACE_TANIMI: "Motorlu ağır kara taşıtlarının sürücüsüz olarak kiralanması ve operasyonel leasingi (ağırlığı 3,5 tondan daha fazla olanlar) (motokaravan için olanlar hariç)", UST_LIMIT_TL: 350000 },
            { MESLEK: "Durak, otopark işletmeciliği", NACE_KODU: "522107", NACE_TANIMI: "Otopark ve garaj işletmeciliği (bisiklet parkları ve karavanların kışın saklanması dahil)", UST_LIMIT_TL: 300000 },
            { MESLEK: "Durak, otopark işletmeciliği", NACE_KODU: "522109", NACE_TANIMI: "Kara yolu yolcu taşımacılığına yönelik otobüs terminal hizmetleri", UST_LIMIT_TL: 300000 },
            { MESLEK: "Durak, otopark işletmeciliği", NACE_KODU: "522110", NACE_TANIMI: "Kara yolu yolcu taşımacılığına yönelik otobüs, minibüs ve taksi duraklarının işletilmesi (otobüs terminal hizmetleri hariç)", UST_LIMIT_TL: 300000 },
            { MESLEK: "Durak, otopark işletmeciliği", NACE_KODU: "522190", NACE_TANIMI: "Kara taşımacılığını destekleyici diğer hizmetler (kamyon terminal işletmeciliği dahil)", UST_LIMIT_TL: 300000 },
            { MESLEK: "Durak, otopark işletmeciliği", NACE_KODU: "969905", NACE_TANIMI: "Kendi hesabına çalışan valelerin hizmetleri", UST_LIMIT_TL: 250000 },
            { MESLEK: "Trafik müşavirliği, iş takipçiliği", NACE_KODU: "829904", NACE_TANIMI: "Trafik müşavirliği", UST_LIMIT_TL: 300000 },
            { MESLEK: "Trafik müşavirliği, iş takipçiliği", NACE_KODU: "829908", NACE_TANIMI: "İş takipçiliği faaliyeti", UST_LIMIT_TL: 300000 },
            { MESLEK: "Dövme salonu işletmeciliği", NACE_KODU: "969999", NACE_TANIMI: "Başka yerde sınıflandırılmamış diğer hizmet faaliyetleri (dövme ve piercing hizmetleri vb.)", UST_LIMIT_TL: 300000 },
            { MESLEK: "Kuyumculuk", NACE_KODU: "89903", NACE_TANIMI: "Kıymetli ve yarı kıymetli taşların ocakçılığı (kehribar, Oltu taşı, lüle taşı ve elmas hariç)", UST_LIMIT_TL: 350000 },
            { MESLEK: "Kuyumculuk", NACE_KODU: "244116", NACE_TANIMI: "İşlenmemiş, yarı işlenmiş, toz halde, altın imalatı ile gümüş veya adi metallerin altınla preslenerek kaplanması (Mücevher ve benzeri eşyaların imalatı hariç)", UST_LIMIT_TL: 350000 },
            { MESLEK: "Kuyumculuk", NACE_KODU: "244117", NACE_TANIMI: "İşlenmemiş, yarı işlenmiş, toz halde adi metallerin gümüşle preslenerek kaplanması (Mücevher ve benzeri eşyaların imalatı hariç)", UST_LIMIT_TL: 350000 },
            { MESLEK: "Kuyumculuk", NACE_KODU: "244118", NACE_TANIMI: "İşlenmemiş, yarı işlenmiş, toz halde platin imalatı ile altın, gümüş veya adi metallerin platinle preslenerek kaplanması (paladyum, rodyum, osmiyum ve rutenyum imalatı ile platin katalizör imalatı dahil) (Mücevher ve benzeri eşyaların imalatı hariç)", UST_LIMIT_TL: 350000 },
            { MESLEK: "Kuyumculuk", NACE_KODU: "244119", NACE_TANIMI: "Değerli metal alaşımlarının imalatı (Mücevher ve benzeri eşyaların imalatı hariç)", UST_LIMIT_TL: 350000 },
            { MESLEK: "Kuyumculuk", NACE_KODU: "321201", NACE_TANIMI: "Değerli metallerden takı ve mücevherlerin imalatı (değerli metallerle baskı, yapıştırma vb. yöntemlerle giydirilmiş adi metallerden olanlar dahil)", UST_LIMIT_TL: 350000 },
            { MESLEK: "Kuyumculuk", NACE_KODU: "321204", NACE_TANIMI: "İnci ve değerli doğal taşların işlenmesi ve değerli taşlardan takı ve mücevher ile bunların parçalarının imalatı (sentetik veya yeniden oluşturulmuş olanlar dahil)", UST_LIMIT_TL: 350000 },
            { MESLEK: "Kuyumculuk", NACE_KODU: "321290", NACE_TANIMI: "Mücevher ve benzeri diğer eşyaların imalatı", UST_LIMIT_TL: 350000 },
            { MESLEK: "Kuyumculuk", NACE_KODU: "329903", NACE_TANIMI: "Pipo, sigara ağızlıkları, Oltu veya lüle taşından tespih vb. imalatı", UST_LIMIT_TL: 350000 },
            { MESLEK: "Kuyumculuk", NACE_KODU: "464801", NACE_TANIMI: "Mücevher ve takı toptan ticareti (altın, gümüş, vb. olanlar) (imitasyon olanlar hariç)", UST_LIMIT_TL: 350000 },
            { MESLEK: "Kuyumculuk", NACE_KODU: "468202", NACE_TANIMI: "Değerli metal cevherleri ve konsantrelerinin toptan ticareti (altın, gümüş, platin vb.)", UST_LIMIT_TL: 350000 },
            { MESLEK: "Kuyumculuk", NACE_KODU: "477701", NACE_TANIMI: "Altın ve diğer değerli metallerden takı, eşya ve mücevherat perakende ticareti (kuyumculuk ürünleri perakende ticareti dahil, gümüşten olanlar hariç)", UST_LIMIT_TL: 350000 },
            { MESLEK: "Kuyumculuk", NACE_KODU: "477702", NACE_TANIMI: "Gümüş takı, eşya ve mücevherat perakende ticareti (gümüşçü ürünleri perakende ticareti)", UST_LIMIT_TL: 350000 },
            { MESLEK: "Kuyumculuk", NACE_KODU: "477705", NACE_TANIMI: "Doğal inciden veya kültür incisinden ürünler ile değerli ya da yarı değerli taşlardan yapılan ürünlerin perakende ticareti (pırlanta, yakut, zümrüt, safir ve benzerinden yapılan ürünler)", UST_LIMIT_TL: 350000 },
            { MESLEK: "Kuyumculuk", NACE_KODU: "952502", NACE_TANIMI: "Mücevherlerin onarımı", UST_LIMIT_TL: 300000 },
            { MESLEK: "Nakliyat komisyonculuğu", NACE_KODU: "522603", NACE_TANIMI: "Kara yolu yük nakliyat acentelerinin faaliyetleri", UST_LIMIT_TL: 300000 },
            { MESLEK: "Nakliyat komisyonculuğu", NACE_KODU: "523102", NACE_TANIMI: "Kara yolu yük nakliyat komisyoncularının faaliyetleri", UST_LIMIT_TL: 300000 },
            { MESLEK: "Şans oyunları bayiliği", NACE_KODU: "920002", NACE_TANIMI: "Loto vb. sayısal şans oyunlarına ilişkin faaliyetler (piyango biletlerinin satışı dahil)", UST_LIMIT_TL: 300000 },
            { MESLEK: "Şans oyunları bayiliği", NACE_KODU: "920001", NACE_TANIMI: "Müşterek bahis faaliyetleri (at yarışı, köpek yarışı, futbol ve diğer spor yarışmaları konusunda bahis hizmetleri)", UST_LIMIT_TL: 250000 }
];

export default function LimitSorgulama() {
  // ⭐️ YENİ: State Tanımları (Tipler atandı)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // searchResult durumunu sınırlı string tipleriyle tanımladık
  const [searchResult, setSearchResult] = useState<'found' | 'notfound' | 'error' | null>(null); 
  // foundData tipini NaceData veya null olarak tanımladık
  const [foundData, setFoundData] = useState<NaceData | null>(null); 
  const [naceCode, setNaceCode] = useState<string>('');

  const handleSearch = (e: React.FormEvent): void => { // event tipini React.FormEvent olarak tanımladık
    e.preventDefault();
    if (naceCode.length !== 6) { 
        setSearchResult('error'); 
        setFoundData(null);
        return;
    }
    
    setIsLoading(true);
    setSearchResult(null);
    setFoundData(null);

    // Sorgulama simülasyonu (Gerçek hissi vermek için kısa gecikme)
    setTimeout(() => {
      // ⭐️ YENİ: find metodunun sonucu NaceData veya undefined olabilir, tip kontrolü yapıldı
      const result: NaceData | undefined = naceVerileri.find(item => item.NACE_KODU === naceCode);
      
      if (result) {
        setFoundData(result);
        setSearchResult('found');
      } else {
        setSearchResult('notfound');
      }
      setIsLoading(false);
    }, 1000);
  };

  // Para formatı
  const formatMoney = (val: number): string => { // Fonksiyon tip tanımı yapıldı
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 flex flex-col">
      <Navbar />
      
      {/* Ana Kapsayıcı: Arka plan efektleri */}
      <main className="flex-grow relative overflow-hidden">
        
        {/* --- GLOBAL ARKA PLAN EFEKTLERİ (Mesh Gradient) --- */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen"></div>
            <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
            <div className="absolute bottom-[-10%] left-1/3 w-[900px] h-[500px] bg-slate-700/20 blur-[120px] rounded-full mix-blend-screen"></div>
        </div>

        {/* --- BAŞLIK BÖLÜMÜ --- */}
        <div className="relative z-10 pt-20 pb-12 lg:pt-24 lg:pb-16 text-center">
            <div className="container mx-auto px-4">
                <div className="inline-flex items-center justify-center space-x-3 mb-4 opacity-90">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400"></div>
                    <span className="text-amber-400 font-bold tracking-[0.25em] uppercase text-xs md:text-sm">LİMİT & RİSK DURUMU</span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400"></div>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl">
                  NACE Kodu İle <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-indigo-400">Limit Sorgulama</span>
                </h1>
                
                <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
                  Vergi levhanızda yer alan "Ana Faaliyet Kodu" (NACE) ile kooperatifimiz limitleri dahilinde kullanabileceğiniz azami tutarı öğrenin.
                </p>
                
                <div className="mt-12 w-full max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
            </div>
        </div>

        {/* --- SORGULAMA ALANI --- */}
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            
            {/* Sorgulama Kartı */}
            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                
                {/* Dekoratif Işık */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-amber-500 to-indigo-500"></div>

                <form onSubmit={handleSearch} className="relative z-10">
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center p-4 bg-slate-900/50 rounded-full mb-4 border border-slate-700 shadow-inner">
                            <Search className="w-8 h-8 text-amber-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">NACE Kodu Sorgula</h3>
                        <p className="text-slate-400 text-xs mt-2">Lütfen 6 haneli NACE kodunuzu bitişik giriniz (Örn: 561107)</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="relative">
                                <input 
                                  type="text" 
                                  maxLength={6}
                                  value={naceCode}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNaceCode(e.target.value.replace(/\D/g, ''))} // event tipini tanımladık
                                  className="w-full bg-slate-900/60 border border-slate-600/50 rounded-xl px-5 py-4 text-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all tracking-widest text-center font-mono"
                                  placeholder="______"
                                />
                                <Barcode className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            </div>
                        </div>

                        <button 
                          type="submit"
                          disabled={isLoading || naceCode.length !== 6}
                          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-indigo-900/30 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Kontrol Ediliyor...
                                </>
                            ) : (
                                <>
                                    Limiti Göster
                                    <CreditCard className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* SONUÇ EKRANI: BAŞARILI */}
                {searchResult === 'found' && foundData && (
                    <div className="mt-8 pt-8 border-t border-slate-700/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-gradient-to-br from-emerald-900/30 to-slate-900/50 border border-emerald-500/30 rounded-2xl p-6">
                            <div className="flex items-center justify-center gap-2 text-emerald-400 mb-6">
                                <CheckCircle2 size={24} />
                                <span className="text-base font-bold uppercase tracking-wider">Kayıt Bulundu</span>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Briefcase size={16} />
                                        <span className="text-sm">Meslek Grubu</span>
                                    </div>
                                    <span className="text-white font-semibold text-right">{foundData.MESLEK}</span>
                                </div>
                                
                                <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Barcode size={16} />
                                        <span className="text-sm">NACE Kodu</span>
                                    </div>
                                    <span className="text-white font-mono">{foundData.NACE_KODU}</span>
                                </div>

                                <div className="flex flex-col gap-1 border-b border-slate-700/50 pb-2">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <FileText size={16} />
                                        <span className="text-sm">Tanım</span>
                                    </div>
                                    <span className="text-slate-300 text-sm italic mt-1">{foundData.NACE_TANIMI}</span>
                                </div>
                                
                                <div className="pt-2 text-center">
                                    <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Kredi Üst Limiti</p>
                                    <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-lg">
                                        {formatMoney(foundData.UST_LIMIT_TL)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* SONUÇ EKRANI: BULUNAMADI */}
                {searchResult === 'notfound' && (
                    <div className="mt-8 pt-8 border-t border-slate-700/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-gradient-to-br from-red-900/30 to-slate-900/50 border border-red-500/30 rounded-2xl p-6 text-center">
                            <div className="flex items-center justify-center gap-2 text-red-400 mb-4">
                                <AlertCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Kayıt Bulunamadı</h3>
                            <p className="text-slate-400 text-sm">
                                Girdiğiniz <strong>{naceCode}</strong> kodu ile eşleşen bir kayıt sistemimizde bulunamadı. Lütfen kodu kontrol edip tekrar deneyiniz.
                            </p>
                        </div>
                    </div>
                )}

                {/* SONUÇ EKRANI: HATALI GİRİŞ */}
                {searchResult === 'error' && (
                    <div className="mt-8 pt-8 border-t border-slate-700/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-gradient-to-br from-yellow-900/30 to-slate-900/50 border border-yellow-500/30 rounded-2xl p-6 text-center">
                            <div className="flex items-center justify-center gap-2 text-yellow-400 mb-4">
                                <AlertCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Hatalı Giriş</h3>
                            <p className="text-slate-400 text-sm">
                                Lütfen NACE kodunu doğru formatta (6 haneli, bitişik ve sadece rakamlardan oluşacak şekilde) giriniz.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* BİLGİLENDİRME KARTLARI */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
                <div className="bg-slate-800/30 border border-slate-700/50 p-6 rounded-2xl">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400 mb-4">
                        <TrendingUp size={20} />
                    </div>
                    <h4 className="text-white font-bold mb-2">NACE Kodu Nedir?</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        İş yerinizin faaliyet alanını belirleyen 6 haneli koddur. Vergi levhanızda "Ana Faaliyet Kodu" başlığı altında bulabilirsiniz.
                    </p>
                </div>

                <div className="bg-slate-800/30 border border-slate-700/50 p-6 rounded-2xl">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 mb-4">
                        <ShieldAlert size={20} />
                    </div>
                    <h4 className="text-white font-bold mb-2">Risk Grubu</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Kredi limitiniz sadece NACE koduna değil, kredi notunuza ve geçmiş ödeme performansınıza göre de değişiklik gösterebilir.
                    </p>
                </div>

                <div className="bg-slate-800/30 border border-slate-700/50 p-6 rounded-2xl">
                    <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center text-cyan-400 mb-4">
                        <CreditCard size={20} />
                    </div>
                    <h4 className="text-white font-bold mb-2">Mevcut Borçlar</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Halkbank veya diğer kooperatiflerdeki mevcut risk bakiyeniz, burada görünen yeni limitinizden düşülür.
                    </p>
                </div>
            </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}