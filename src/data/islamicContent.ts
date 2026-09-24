import { DailyDua, DailyHadith, DailyVerse, EsmaUlHusna, WisdomQuote } from '../types/prayer';

export const DAILY_VERSES: DailyVerse[] = [
  {
    id: 'verse-1',
    arabic: 'وَأَقِمِ الصَّلَاةَ طَرَفَيِ النَّهَارِ وَزُلَفًا مِّنَ اللَّيْلِ ۚ إِنَّ الْحَسَنَاتِ يُذْهِبْنَ السَّيِّئَاتِ',
    translation: 'Gündüzün iki tarafında ve gecenin gündüze yakın vakitlerinde namaz kıl. Çünkü iyilikler, kötülükleri giderir. Bu, ibret alanlara bir öğüttür.',
    surahName: 'Hûd Sûresi',
    surahNumber: 11,
    ayahNumber: 114,
    topic: 'Namaz & Arınma'
  },
  {
    id: 'verse-2',
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    translation: 'Öyleyse siz beni (ibadet ve itaatle) anın ki, ben de sizi anayım. Bana şükredin; sakın nankörlük etmeyin!',
    surahName: 'Bakara Sûresi',
    surahNumber: 2,
    ayahNumber: 152,
    topic: 'Zikir & Şükür'
  },
  {
    id: 'verse-3',
    arabic: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ',
    translation: 'Kullarım sana beni sorduklarında bilsinler ki, şüphesiz ben onlara çok yakınım. Bana dua edenin duasına icabet ederim.',
    surahName: 'Bakara Sûresi',
    surahNumber: 2,
    ayahNumber: 186,
    topic: 'Dua & Yakınlık'
  },
  {
    id: 'verse-4',
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'Şüphesiz her zorlukla beraber bir kolaylık vardır.',
    surahName: 'İnşirâh Sûresi',
    surahNumber: 94,
    ayahNumber: 6,
    topic: 'Sabır & Ümit'
  },
  {
    id: 'verse-5',
    arabic: 'حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ',
    translation: 'Namazlara ve özellikle orta namaza (ikindiye) devam edin; Allah’ın huzurunda boyun eğerek divan durun.',
    surahName: 'Bakara Sûresi',
    surahNumber: 2,
    ayahNumber: 238,
    topic: 'Namazın Önemi'
  }
];

export const DAILY_HADITHS: DailyHadith[] = [
  {
    id: 'hadith-1',
    arabic: 'الصَّلَاةُ عِمَادُ الدِّينِ',
    text: 'Namaz dinin direğidir. Onu ikame eden dinini ikame etmiş, onu terk eden dinini yıkmış olur.',
    narrator: 'Hz. Ali (r.a.)',
    source: 'Beyhaki, Şuabü’l-İman',
    topic: 'Namaz'
  },
  {
    id: 'hadith-2',
    arabic: 'مَنْ غَدَا إِلَى الْمَسْجِدِ أَوْ رَاحَ، أَعَدَّ اللَّهُ لَهُ فِي الْجَنَّةِ نُزُلًا',
    text: 'Kim sabah veya akşam mescide gider gelirse, her gidiş ve gelişinde Allah Teâlâ onun için cennette özel bir ağırlama hazırlar.',
    narrator: 'Ebu Hüreyre (r.a.)',
    source: 'Buhari, Ezan 37; Müslim, Mesacid 285',
    topic: 'Cami ve Cemaat'
  },
  {
    id: 'hadith-3',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    text: 'Sizin en hayırlınız, Kur’an-ı Kerim’i öğrenen ve onu başkalarına öğretendir.',
    narrator: 'Hz. Osman (r.a.)',
    source: 'Buhari, Fedailü’l-Kur’an 21',
    topic: 'Kuran Ahlakı'
  },
  {
    id: 'hadith-4',
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
    text: 'Ameller niyetlere göredir. Herkes için ancak niyet ettiği şey vardır.',
    narrator: 'Hz. Ömer (r.a.)',
    source: 'Buhari, Bed’ü’l-Vahy 1; Müslim, İmare 155',
    topic: 'İhlas ve Niyet'
  },
  {
    id: 'hadith-5',
    arabic: 'الدُّعَاءُ مُخُّ الْعِبَادَةِ',
    text: 'Dua, ibadetin özüdür.',
    narrator: 'Enes b. Malik (r.a.)',
    source: 'Tirmizi, Daavat 1',
    topic: 'Dua'
  }
];

export const WISDOM_QUOTES: WisdomQuote[] = [
  {
    id: 'quote-1',
    quote: 'Namaz, can aynasını cilalamaktır. O aynada Hakk’ın cemali görünür.',
    author: 'Mevlânâ Celâleddîn-i Rûmî',
    era: 'Mesnevî-i Şerif'
  },
  {
    id: 'quote-2',
    quote: 'İlim ilim bilmektir, ilim kendin bilmektir. Sen kendini bilmezsin, ya nice okumaktır.',
    author: 'Yunus Emre',
    era: 'Tasavvuf Divanı'
  },
  {
    id: 'quote-3',
    quote: 'Kalp bir ayna gibidir; günahlar pası, zikir ve namaz ise cilasıdır.',
    author: 'İmam Gazâlî',
    era: 'İhyâu Ulûmi’d-Dîn'
  },
  {
    id: 'quote-4',
    quote: 'Eline, diline, beline sahip ol. Harama bakma, haram yeme, haram içme.',
    author: 'Hacı Bektâş-ı Velî',
    era: 'Makâlât'
  },
  {
    id: 'quote-5',
    quote: 'Vakit kılıç gibidir; sen onu hayırla kesmezsen, o seni heba ile keser.',
    author: 'İmam Şâfiî',
    era: 'Hikmetler Kitabı'
  }
];

export const DAILY_DUAS: DailyDua[] = [
  {
    id: 'dua-1',
    title: 'Sabah & Akşam Afiyet Duası',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ',
    turkishReading: 'Allahümme innî es’elüke’l-afve ve’l-âfiyete fid-dünyâ vel-âhireh.',
    meaning: 'Allah’ım! Senden dünyada ve ahirette af, sağlık, selamet ve esenlik diliyorum.',
    benefit: 'Peygamber Efendimiz (s.a.v.) bu duayı sabah ve akşam hiç terk etmezdi.'
  },
  {
    id: 'dua-2',
    title: 'Ezan Sonrası Okunacak Dua',
    arabic: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
    turkishReading: 'Allahümme rabbe hâzihi’d-da’veti’t-tâmmeh, ves-salâti’l-kâimeh, âti Muhammedenil-vesîlete vel-fadîleh, veb’ashü makâmen mahmûdenillezi vaadteh.',
    meaning: 'Ey bu eksiksiz davetin ve kılınacak namazın Rabbi olan Allah’ım! Muhammed’e vesileyi ve fazileti ver. Onu vadettiğin Makam-ı Mahmud’a eriştir.',
    benefit: 'Ezan bitince bu duayı okuyana Peygamberimiz’in şefaati hak olur (Buhari).'
  },
  {
    id: 'dua-3',
    title: 'Huzur ve Kalp Genişliği Duası',
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي',
    turkishReading: 'Rabbişrah lî sadrî ve yessir lî emrî, vahlul ukdeten min lisânî yefkahû kavlî.',
    meaning: 'Rabbim! Göğsüme genişlik ver, işimi kolaylaştır. Dilimdeki düğümü çöz ki sözümü iyi anlasınlar.',
    benefit: 'Hz. Musa’nın (a.s.) duasıdır; sıkıntı, imtihan ve heyecan anında sükunet verir.'
  },
  {
    id: 'dua-4',
    title: 'Evden Çıkarken Okunan Dua',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    turkishReading: 'Bismillâhi tevekkeltü alallâh, lâ havle ve lâ kuvvete illâ billâh.',
    meaning: 'Allah’ın adıyla. Allah’a tevekkül ettim. Güç ve kuvvet ancak Yüce Allah’ın yardımıyladır.',
    benefit: 'Bu duayı okuyana melekler: "Hidayete erdirildin, korundun ve kötülükler senden uzaklaştırıldı" der.'
  }
];

export const ESMA_UL_HUSNA: EsmaUlHusna[] = [
  { number: 1, nameArabic: 'الله', nameTurkish: 'Allah', meaning: 'Her şeyin yaratıcısı, ibadete layık tek ilah.', ebcedValue: 66, virtue: 'Kalbi nurlandırır, marifetullah kapılarını açar.' },
  { number: 2, nameArabic: 'الرَّحْمَنُ', nameTurkish: 'Er-Rahmân', meaning: 'Dünyada inanan ve inanmayan bütün mahlûkata merhamet eden.', ebcedValue: 298, virtue: 'Gönüllere merhamet ve sekine indirir.' },
  { number: 3, nameArabic: 'الرَّحِيمُ', nameTurkish: 'Er-Rahîm', meaning: 'Ahirette yalnızca müminlere nihayetsiz lütufta bulunan.', ebcedValue: 258, virtue: 'Maddi ve manevi rızkı bereketlendirir.' },
  { number: 4, nameArabic: 'الْمَلِكُ', nameTurkish: 'El-Melik', meaning: 'Bütün kainatın mutlak hükümdarı ve sahibi.', ebcedValue: 90, virtue: 'İzzet ve şeref kazandırır, vesveseyi defeder.' },
  { number: 5, nameArabic: 'الْقُدُّوسُ', nameTurkish: 'El-Kuddûs', meaning: 'Her türlü noksanlıktan, ayıptan ve kusurdan münezzeh olan.', ebcedValue: 170, virtue: 'Kalbi ve nefsi kötü arzulardan arındırır.' },
  { number: 6, nameArabic: 'السَّلَامُ', nameTurkish: 'Es-Selâm', meaning: 'Her türlü tehlike ve zevalden selamet veren, esenlik kaynağı.', ebcedValue: 131, virtue: 'Korkulardan emin kılar, iç huzuru verir.' },
  { number: 7, nameArabic: 'الْمُؤْمِنُ', nameTurkish: 'El-Mü’min', meaning: 'Gönüllere iman nuru veren, sığınanları güvende kılan.', ebcedValue: 136, virtue: 'Düşman şerrinden ve hıyanetten korur.' },
  { number: 8, nameArabic: 'الْمُهَيْمِنُ', nameTurkish: 'El-Müheymin', meaning: 'Her şeyi görüp gözeten, himaye ve murakabe eden.', ebcedValue: 145, virtue: 'İhlas ve manevi idrak kabiliyetini artırır.' },
  { number: 9, nameArabic: 'الْعَزِيزُ', nameTurkish: 'El-Azîz', meaning: 'Mağlup edilmesi imkânsız olan, daima galip ve izzet sahibi.', ebcedValue: 94, virtue: 'Hürmet ve itibar kazandırır, zilleti giderir.' },
  { number: 10, nameArabic: 'الْجَبَّارُ', nameTurkish: 'El-Cebbâr', meaning: 'Kırılanları onaran, dilediğini zorla da olsa yaptıran.', ebcedValue: 206, virtue: 'Zalimlerin zulmünden korur, işleri yoluna koyar.' },
  { number: 11, nameArabic: 'الْمُتَكَبِّرُ', nameTurkish: 'El-Mütekebbir', meaning: 'Büyüklük ve azamet ancak kendisine yakışan yegane varlık.', ebcedValue: 662, virtue: 'Hayırlı mevki ve bereket ihsan olunur.' },
  { number: 12, nameArabic: 'الْخَالِقُ', nameTurkish: 'El-Hâlık', meaning: 'Her şeyi yoktan var eden, yaratan.', ebcedValue: 731, virtue: 'Zor ve çıkmaz işleri kolaylaştırır.' }
];

export interface NamazRehberStep {
  rekats: string;
  steps: {
    title: string;
    description: string;
    readings?: string;
  }[];
}

export const DINI_BILGILER = {
  otuzIkiFarz: [
    { title: 'İmanın Şartları (6)', items: ['Allah’a inanmak', 'Meleklerine inanmak', 'Kitaplarına inanmak', 'Peygamberlerine inanmak', 'Ahiret gününe inanmak', 'Kader ve kazaya (hayır ve şerrin Allah’tan olduğuna) inanmak'] },
    { title: 'İslam’ın Şartları (5)', items: ['Kelime-i Şehadet getirmek', 'Namaz kılmak', 'Oruç tutmak', 'Zekat vermek', 'Hacca gitmek'] },
    { title: 'Namazın Farzları (12)', items: [
      'Dışındakiler (Şartlar): Hadesten taharet (Abdest/Gusül), Necasetten taharet (Maddî temizlik), Setr-i avret (Örtünme), İstikbâl-i Kıble (Kıbleye yönelme), Vakit, Niyet',
      'İçindekiler (Rükünler): İftitah tekbiri, Kıyam (Ayakta duruş), Kıraat (Kur’an okuma), Rükû, Secde, Ka’de-i ahîre (Son oturuş)'
    ]},
    { title: 'Abdestin Farzları (4)', items: ['Yüzü yıkamak', 'Kolları dirseklerle beraber yıkamak', 'Başın dörtte birini meshetmek', 'Ayakları topuklarla beraber yıkamak'] },
    { title: 'Guslün Farzları (3)', items: ['Ağza bol su verip çalkalamak (Mazmaza)', 'Burna bol su çekip temizlemek (İstinşak)', 'Bütün vücudu iğne ucu kadar kuru yer kalmayacak şekilde yıkamak'] },
    { title: 'Teyemmümün Farzları (2)', items: ['Niyet etmek', 'İki elin içini temiz toprağa vurup yüze meshetmek ve tekrar vurup kollara meshetmek'] }
  ]
};
