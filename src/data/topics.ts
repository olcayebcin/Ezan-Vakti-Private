// Curated topic pages (read-only). Dates are given as Hicrî / Milâdî where known.
// Items marked `rivayet` are traditions or popular accounts, not established facts.

export interface TopicPage {
  id: string;
  title: string;
  arabicTitle: string;
  subtitle: string;
  lifespan: string;
  ringColor: string;
  intro: string;
  facts: { label: string; value: string }[];
  timeline: { date: string; text: string; rivayet?: boolean }[];
  works: { title: string; text: string }[];
  concepts: { term: string; text: string }[];
  quotes: { text: string; source: string }[];
  /** Commonly repeated claims that need a correction. */
  corrections?: { claim: string; text: string }[];
  sources: string[];
}

export const TOPICS: TopicPage[] = [
  {
    id: 'ibn-arabi',
    title: 'İbn Arabî',
    arabicTitle: 'ابن عربي',
    subtitle: 'eş-Şeyhü’l-Ekber · Muhyiddîn',
    lifespan: '1165 – 1240',
    ringColor: '#a855f7',
    intro:
      'Endülüslü mutasavvıf ve düşünür. Tasavvuf düşüncesini sistemli bir metafiziğe dönüştüren en etkili isimlerden biridir; ' +
      'bu yüzden “en büyük şeyh” anlamında eş-Şeyhü’l-Ekber diye anılır. Görüşleri Osmanlı ilim ve tasavvuf dünyasını derinden etkilemiştir.',
    facts: [
      { label: 'Tam adı', value: 'Ebû Abdillâh Muhyiddîn Muhammed b. Alî b. Muhammed İbnü’l-Arabî et-Tâî el-Hâtimî' },
      { label: 'Doğum', value: '17 Ramazan 560 / 28 Temmuz 1165, Mürsiye (Murcia), Endülüs' },
      { label: 'Vefat', value: '22 Rebîülâhir 638 / 16 Kasım 1240, Dımaşk (Şam)' },
      { label: 'Kabri', value: 'Şam, Sâlihiyye. Türbesi ve camisi Yavuz Sultan Selim tarafından yaptırılmıştır (1517-18).' },
      { label: 'Soyu', value: 'Cömertliğiyle bilinen Hâtem et-Tâî’nin mensup olduğu Tay kabilesinden' },
      { label: 'Lakapları', value: 'eş-Şeyhü’l-Ekber (en büyük şeyh), Muhyiddîn (dini dirilten)' },
    ],
    timeline: [
      { date: '1165', text: 'Mürsiye’de doğdu.' },
      { date: '1172', text: 'Ailesiyle İşbîliye’ye (Sevilla) taşındı; gençliği burada geçti.' },
      { date: '~1180', text: 'Kurtuba’da (Córdoba) filozof İbn Rüşd ile görüştü. Bu görüşmeyi daha sonra Fütûhât’ta anlatır.' },
      { date: '~1184', text: 'Tasavvuf yoluna girdi; Endülüs ve Kuzey Afrika’da pek çok şeyhten istifade etti.' },
      { date: '1201-02', text: 'Doğuya gitmek üzere Endülüs’ten ayrıldı; hac için Mekke’ye ulaştı ve el-Fütûhâtü’l-Mekkiyye’yi yazmaya başladı.' },
      { date: '1204-05', text: 'Anadolu’ya geldi: Konya ve Malatya. Sadreddin Konevî’nin annesiyle evlendi; Konevî onun en önemli talebesi ve şârihi oldu.' },
      { date: '1223', text: 'Şam’a yerleşti; ömrünün sonuna kadar burada yaşadı ve eserlerini burada tamamladı.' },
      { date: '1229', text: 'Şam’da, rüyada Hz. Peygamber’den aldığını söylediği Fusûsü’l-Hikem’i yazdı.' },
      { date: '1238', text: 'el-Fütûhâtü’l-Mekkiyye’nin ikinci ve son nüshasını tamamladı.' },
      { date: '1240', text: 'Şam’da vefat etti.' },
      { date: '1516-18', text: 'Yavuz Sultan Selim Şam’a girdikten sonra kabrini buldurup üzerine türbe ve cami yaptırdı.' },
      { date: '—', text: 'Bunun, İbn Arabî’ye nispet edilen “Sîn Şîn’e girince Muhyiddîn’in kabri ortaya çıkar” sözüyle önceden haber verildiği anlatılır (Sîn: Selim, Şîn: Şam).', rivayet: true },
    ],
    works: [
      { title: 'el-Fütûhâtü’l-Mekkiyye', text: 'Mekke’de başlanan, 560 bölümlük dev eseri. Tasavvufun hemen bütün konularını, ibadetlerin iç anlamlarını ve kendi manevi tecrübelerini içerir. Türkçeye tam tercümesi Ekrem Demirli tarafından yapılmıştır.' },
      { title: 'Fusûsü’l-Hikem', text: 'Her bölümü bir peygambere ayrılmış 27 bölümlük özlü eseri; “hikmetlerin yüzük taşları”. Hakkında yüzden fazla şerh yazılmıştır.' },
      { title: 'Tercümânü’l-Eşvâk', text: 'Mekke’de tanıdığı Nizâm’ın ilhamıyla yazdığı aşk şiirleri divanı. Şiirlerin zahirî anlaşılmasına itiraz edilince bunları kendisi şerh etmiştir (Zehâirü’l-A‘lâk).' },
      { title: 'Rûhu’l-Kuds', text: 'Endülüs’te tanıdığı sûfîleri anlatan eser; dönemin tasavvuf hayatı için önemli bir kaynaktır.' },
      { title: 'Diğerleri', text: 'et-Tedbîrâtü’l-İlâhiyye, İnşâü’d-Devâir, Mevâkiu’n-Nücûm, Kitâbü’l-İsrâ, ed-Dîvânü’l-Ekber. Kendisine yüzlerce eser nispet edilir; Osman Yahyâ’nın kataloğunda 800’ü aşkın eser adı geçer.' },
    ],
    concepts: [
      { term: 'Vahdet-i vücûd', text: 'Hakiki varlığın yalnız Allah’a ait olduğu, diğer her şeyin varlığını O’ndan aldığı görüşü. Terim, İbn Arabî’den çok talebeleri ve şârihleri tarafından sistemleştirilmiş ve onun düşüncesinin adı olmuştur.' },
      { term: 'İnsân-ı kâmil', text: 'İlahi isimlerin bütününü kendinde toplayan, Allah’ı ve âlemi en kapsamlı şekilde yansıtan olgun insan.' },
      { term: 'A‘yân-ı sâbite', text: 'Varlıkların, yaratılmadan önce ilahi ilimdeki hakikatleri.' },
      { term: 'Tecellî', text: 'Allah’ın isim ve sıfatlarının âlemde görünür hâle gelmesi; âlem, ilahi isimlerin tecelligâhıdır.' },
      { term: 'Hayâl / Berzah', text: 'Manalarla maddeler arasındaki ara âlem; rüya ve keşfin gerçekleştiği mertebe.' },
      { term: 'Nefes-i Rahmânî', text: 'Varlığın, Rahmân’ın “nefesi” ile kelimeler gibi zuhur ettiği benzetmesi.' },
    ],
    quotes: [
      {
        text: 'Kalbim her sûreti kabul eder oldu: ceylanlar için otlak, rahipler için manastır, putlar için tapınak, tavaf edenler için Kâbe, Tevrat levhaları ve Kur’an mushafı. Ben aşk dinine uyarım; kervanı nereye yönelirse aşk benim dinim ve imanımdır.',
        source: 'Tercümânü’l-Eşvâk',
      },
      {
        text: '“Kendini bilen Rabbini bilir.” (Men arefe nefsehû fekad arefe Rabbehû)',
        source: 'Eserlerinde sık sık şerh ettiği söz; İbn Arabî’ye ait değildir, hadis olarak nakledilir ama sıhhati tartışmalıdır.',
      },
    ],
    sources: [
      'TDV İslâm Ansiklopedisi, “İbnü’l-Arabî, Muhyiddin” maddesi',
      'Claude Addas, Quest for the Red Sulphur: The Life of Ibn ‘Arabī',
      'William C. Chittick, The Sufi Path of Knowledge',
      'Ekrem Demirli, el-Fütûhâtü’l-Mekkiyye tercümesi (Litera Yayıncılık)',
    ],
  },
  {
    id: 'mevlana',
    title: 'Mevlânâ',
    arabicTitle: 'مولانا',
    subtitle: 'Celâleddîn-i Rûmî',
    lifespan: '1207 – 1273',
    ringColor: '#ef4444',
    intro:
      'Mesnevî’nin sahibi büyük mutasavvıf ve şair. Aşk ve hoşgörü merkezli öğretisi, vefatından sonra oğlu Sultan Veled’in öncülüğünde ' +
      'Mevlevîlik tarikatına dönüştü. Eserlerini Farsça yazmış, hayatının büyük bölümünü Konya’da geçirmiştir.',
    facts: [
      { label: 'Adı', value: 'Muhammed Celâleddîn; “Mevlânâ” (efendimiz) ve “Rûmî” (Anadolulu) lakaplarıyla tanınır' },
      { label: 'Doğum', value: '6 Rebîülevvel 604 / 30 Eylül 1207, Belh (bugünkü Afganistan)' },
      { label: 'Vefat', value: '5 Cemâziyelâhir 672 / 17 Aralık 1273, Konya' },
      { label: 'Babası', value: 'Sultânü’l-Ulemâ lakaplı âlim Bahâeddin Veled' },
      { label: 'Kabri', value: 'Konya, Yeşil Türbe (bugün Mevlânâ Müzesi)' },
    ],
    timeline: [
      { date: '1207', text: 'Belh’te doğdu.' },
      { date: '~1212-22', text: 'Ailesiyle Belh’ten göç etti; Nişabur, Bağdat, Mekke, Şam, Malatya, Erzincan ve Akşehir üzerinden Karaman’a (Lârende) geldi.' },
      { date: '~1212', text: 'Nişabur’da Ferîdüddin Attâr ile görüştüğü ve ondan Esrârnâme’yi hediye aldığı anlatılır.', rivayet: true },
      { date: '1226', text: 'Lârende’de oğlu Sultan Veled doğdu.' },
      { date: '1228', text: 'Selçuklu Sultanı I. Alâeddin Keykubad’ın davetiyle aile Konya’ya yerleşti.' },
      { date: '1231', text: 'Babası vefat etti. Seyyid Burhâneddin Muhakkık-ı Tirmizî’nin yanında yıllarca tasavvuf terbiyesi aldı; Halep ve Şam’da tahsilini sürdürdü.' },
      { date: '1244', text: 'Konya’da Şems-i Tebrîzî ile karşılaştı; bu buluşma hayatını ve şiirini kökten değiştirdi.' },
      { date: '~1247', text: 'Şems Konya’dan kesin olarak ayrıldı (akıbeti bilinmiyor). Sonra Selâhaddîn-i Zerkûbî, ardından Hüsâmeddin Çelebi yakın dostu oldu.' },
      { date: '~1258', text: 'Hüsâmeddin Çelebi’nin isteğiyle Mesnevî’yi söylemeye başladı; beyitleri Hüsâmeddin yazıya geçirdi.' },
      { date: '1273', text: 'Konya’da vefat etti. Vefat gecesi “Şeb-i Arûs” (düğün gecesi) olarak anılır.' },
    ],
    works: [
      { title: 'Mesnevî', text: 'Altı ciltlik, yaklaşık 25.600 beyitlik manzum eser. Hikâyeler yoluyla tasavvufi hakikatleri anlatır; “Dinle, bu ney nasıl şikâyet ediyor” beytiyle başlar.' },
      { title: 'Dîvân-ı Kebîr', text: 'Gazel ve rubailerden oluşan büyük divanı; çoğu şiirinde Şems’in adını mahlas olarak kullanır.' },
      { title: 'Fîhi Mâ Fîh', text: 'Sohbetlerinin, yakınları tarafından derlenmiş mensur kaydı.' },
      { title: 'Mektûbât', text: 'Devlet adamlarına ve yakınlarına yazdığı mektuplar.' },
      { title: 'Mecâlis-i Seb‘a', text: 'Yedi vaazından oluşan eser.' },
    ],
    concepts: [
      { term: 'Aşk', text: 'Mevlânâ’da Allah’a ulaştıran temel güç; aklın tek başına varamadığı yere aşkla varılır.' },
      { term: 'Ney', text: 'Kamışlıktan koparılıp özlemle inleyen ney, aslından ayrı düşmüş insan ruhunun sembolüdür.' },
      { term: 'Semâ', text: 'Mevlânâ’nın coşkuyla yaptığı dönüş; sonradan Mevlevîlikte belirli bir düzene bağlanmış zikir ve ibadet şeklidir.' },
      { term: 'Şeb-i Arûs', text: 'Ölümün sevgiliye kavuşma olduğu inancıyla vefat gecesine verilen ad; her yıl 17 Aralık’ta anılır.' },
    ],
    quotes: [
      { text: 'Dinle, bu ney nasıl şikâyet ediyor, ayrılıklardan nasıl hikâye ediyor.', source: 'Mesnevî, 1. beyit' },
      { text: 'Hamdım, piştim, yandım.', source: 'Hayatını özetleyen söz olarak bilinir; eserlerinde bu kalıpla geçmez, halk arasında ona nispet edilir.' },
    ],
    corrections: [
      {
        claim: '“Gel, gel, ne olursan ol yine gel…”',
        text: 'Mevlânâ’ya ait sanılan bu rubai onun eserlerinde bulunmaz; Ebû Saîd-i Ebü’l-Hayr’a veya başka şairlere nispet edilir.',
      },
    ],
    sources: [
      'TDV İslâm Ansiklopedisi, “Mevlânâ Celâleddîn-i Rûmî” maddesi',
      'Abdülbâki Gölpınarlı, Mevlânâ Celâleddin: Hayatı, Eserleri, Felsefesi',
      'Annemarie Schimmel, Ben Rüzgârım Sen Ateş',
      'Franklin D. Lewis, Rumi: Past and Present, East and West',
    ],
  },
  {
    id: 'yunus-emre',
    title: 'Yunus Emre',
    arabicTitle: 'یونس',
    subtitle: 'Türkçenin gönül şairi',
    lifespan: '~1240 – 1320',
    ringColor: '#22c55e',
    intro:
      'Anadolu’da Türkçe tasavvufi şiirin kurucusu sayılan halk şairi ve mutasavvıf. İlahi aşkı, sade ve içten bir Türkçeyle söylemiş; ' +
      'şiirleri yedi yüz yılı aşkın süredir tekkelerde, camilerde ve halk arasında okunmaktadır.',
    facts: [
      { label: 'Doğum', value: 'Yaklaşık 638 / 1240-41 (vefat kaydındaki 82 yıllık ömre göre hesaplanır)' },
      { label: 'Vefat', value: '720 / 1320-21 (bir mecmuadaki kayda göre)' },
      { label: 'Şeyhi', value: 'Taptuk Emre' },
      { label: 'Kabri', value: 'Pek çok yerde makamı vardır; en yaygın kabul Eskişehir’in Mihalıççık ilçesine bağlı Sarıköy’dür (bugün Yunusemre).' },
      { label: 'Anma', value: 'Doğumunun 750. yılı UNESCO tarafından 1991’de “Yunus Emre Yılı” ilan edildi.' },
    ],
    timeline: [
      { date: '~1240', text: 'Orta Anadolu’da doğduğu tahmin edilir; hayatına dair kesin bilgi azdır.' },
      { date: '—', text: 'Taptuk Emre’nin dergâhına girdi. Kırk yıl dergâha odun taşıdığı ve tek bir eğri odun getirmediği anlatılır.', rivayet: true },
      { date: '1307-08', text: 'Risâletü’n-Nushiyye’yi yazdı (eserde 707 yılı verilir).' },
      { date: '~1320', text: 'Vefat etti.' },
    ],
    works: [
      { title: 'Dîvân', text: 'Çoğu hece, bir kısmı aruz vezniyle yazılmış ilahi ve şiirleri. Pek çoğu bestelenmiş ilahi olarak bugün de okunur.' },
      { title: 'Risâletü’n-Nushiyye', text: 'Yaklaşık 600 beyitlik, öğüt veren mesnevi; akıl, nefis ve ahlak üzerine.' },
    ],
    concepts: [
      { term: 'Aşk', text: 'Yunus’ta yaratılışın sebebi ve insanı Hakk’a götüren yol.' },
      { term: 'Gönül', text: 'Allah’ın nazar ettiği yer; gönül kırmak, ibadetleri boşa çıkaran büyük hata olarak görülür.' },
      { term: 'Ölümsüzlük', text: '“Âşık ölmez” düşüncesi: aşkla yaşayan, sevgiliye kavuştuğu için ölümü yok bilir.' },
    ],
    quotes: [
      { text: 'Gelin tanış olalım, işi kolay kılalım / Sevelim sevilelim, dünya kimseye kalmaz.', source: 'Dîvân' },
      { text: 'Söz ola kese savaşı, söz ola kestire başı / Söz ola ağulu aşı bal ile yağ ede bir söz.', source: 'Dîvân' },
      { text: 'Bir kez gönül yıktın ise, bu kıldığın namaz değil / Yetmiş iki millet dahi elin yüzün yumaz değil.', source: 'Dîvân' },
      { text: 'Ete kemiğe büründüm, Yunus diye göründüm.', source: 'Dîvân' },
    ],
    sources: [
      'TDV İslâm Ansiklopedisi, “Yûnus Emre” maddesi',
      'Abdülbâki Gölpınarlı, Yunus Emre ve Tasavvuf',
      'Mustafa Tatcı, Yunus Emre Dîvânı (tenkitli metin)',
    ],
  },
];
