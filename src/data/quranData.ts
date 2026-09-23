import { JuzProgress, Surah } from '../types/prayer';

export const SURAH_LIST: Surah[] = [
  { id: 1, name: 'Fâtiha', arabicName: 'الفاتحة', transliteration: 'Al-Fatiha', translation: 'Açılış, Başlangıç', ayahCount: 7, revelationType: 'Mekke' },
  { id: 2, name: 'Bakara', arabicName: 'البقرة', transliteration: 'Al-Baqarah', translation: 'Boğa, İnek', ayahCount: 286, revelationType: 'Medine' },
  { id: 3, name: 'Âl-i İmrân', arabicName: 'آل عمران', transliteration: 'Ali Imran', translation: 'İmran Ailesi', ayahCount: 200, revelationType: 'Medine' },
  { id: 4, name: 'Nisâ', arabicName: 'النساء', transliteration: 'An-Nisa', translation: 'Kadınlar', ayahCount: 176, revelationType: 'Medine' },
  { id: 5, name: 'Mâide', arabicName: 'المائدة', transliteration: 'Al-Maidah', translation: 'Sofra', ayahCount: 120, revelationType: 'Medine' },
  { id: 6, name: 'En’âm', arabicName: 'الأنعام', transliteration: 'Al-Anam', translation: 'Koyun, Keçi ve Sığır', ayahCount: 165, revelationType: 'Mekke' },
  { id: 7, name: 'A’râf', arabicName: 'الأعراف', transliteration: 'Al-Araf', translation: 'Yüksek Tepeler', ayahCount: 206, revelationType: 'Mekke' },
  { id: 8, name: 'Enfâl', arabicName: 'الأنفال', transliteration: 'Al-Anfal', translation: 'Savaş Ganimetleri', ayahCount: 75, revelationType: 'Medine' },
  { id: 9, name: 'Tevbe', arabicName: 'التوبة', transliteration: 'At-Tawbah', translation: 'Tövbe ve Bağışlanma', ayahCount: 129, revelationType: 'Medine' },
  { id: 10, name: 'Yûnus', arabicName: 'يونس', transliteration: 'Yunus', translation: 'Yunus Peygamber', ayahCount: 109, revelationType: 'Mekke' },
  { id: 11, name: 'Hûd', arabicName: 'هود', transliteration: 'Hud', translation: 'Hud Peygamber', ayahCount: 123, revelationType: 'Mekke' },
  { id: 12, name: 'Yûsuf', arabicName: 'يوسف', transliteration: 'Yusuf', translation: 'Yusuf Peygamber', ayahCount: 111, revelationType: 'Mekke' },
  { id: 13, name: 'Ra’d', arabicName: 'الرعد', transliteration: 'Ar-Rad', translation: 'Gök Gürültüsü', ayahCount: 43, revelationType: 'Medine' },
  { id: 14, name: 'İbrâhîm', arabicName: 'إبراهيم', transliteration: 'Ibrahim', translation: 'İbrahim Peygamber', ayahCount: 52, revelationType: 'Mekke' },
  { id: 15, name: 'Hicr', arabicName: 'الحجر', transliteration: 'Al-Hijr', translation: 'Taşlık Vadi', ayahCount: 99, revelationType: 'Mekke' },
  { id: 16, name: 'Nahl', arabicName: 'النحل', transliteration: 'An-Nahl', translation: 'Bal Arısı', ayahCount: 128, revelationType: 'Mekke' },
  { id: 17, name: 'İsrâ', arabicName: 'الإسراء', transliteration: 'Al-Isra', translation: 'Gece Yürüyüşü', ayahCount: 111, revelationType: 'Mekke' },
  { id: 18, name: 'Kehf', arabicName: 'الكهف', transliteration: 'Al-Kahf', translation: 'Mağara Ehli', ayahCount: 110, revelationType: 'Mekke' },
  { id: 19, name: 'Meryem', arabicName: 'مريم', transliteration: 'Maryam', translation: 'Hz. Meryem', ayahCount: 98, revelationType: 'Mekke' },
  { id: 20, name: 'Tâhâ', arabicName: 'طه', transliteration: 'Ta-Ha', translation: 'Tâhâ', ayahCount: 135, revelationType: 'Mekke' },
  { id: 36, name: 'Yâsîn', arabicName: 'يس', transliteration: 'Ya-Sin', translation: 'Kur’an’ın Kalbi', ayahCount: 83, revelationType: 'Mekke' },
  { id: 55, name: 'Rahmân', arabicName: 'الرحمن', transliteration: 'Ar-Rahman', translation: 'Sonsuz Merhamet Sahibi', ayahCount: 78, revelationType: 'Medine' },
  { id: 56, name: 'Vâkıa', arabicName: 'الواقعة', transliteration: 'Al-Waqiah', translation: 'Kıyamet Olayı', ayahCount: 96, revelationType: 'Mekke' },
  { id: 67, name: 'Mülk (Tebâreke)', arabicName: 'الملك', transliteration: 'Al-Mulk', translation: 'Mutlak Hükümranlık', ayahCount: 30, revelationType: 'Mekke' },
  { id: 78, name: 'Nebe (Amme)', arabicName: 'النبأ', transliteration: 'An-Naba', translation: 'Büyük Haber', ayahCount: 40, revelationType: 'Mekke' },
  { id: 93, name: 'Duhâ', arabicName: 'الضحى', transliteration: 'Ad-Duha', translation: 'Kuşluk Vakti', ayahCount: 11, revelationType: 'Mekke' },
  { id: 94, name: 'İnşirâh', arabicName: 'الشرح', transliteration: 'Ash-Sharh', translation: 'Gönül Ferahlığı', ayahCount: 8, revelationType: 'Mekke' },
  { id: 97, name: 'Kadir', arabicName: 'القدر', transliteration: 'Al-Qadr', translation: 'Kadir Gecesi', ayahCount: 5, revelationType: 'Mekke' },
  { id: 103, name: 'Asr', arabicName: 'العصر', transliteration: 'Al-Asr', translation: 'Zaman ve İkindi', ayahCount: 3, revelationType: 'Mekke' },
  { id: 108, name: 'Kevser', arabicName: 'الكوثر', transliteration: 'Al-Kawthar', translation: 'Bitmez Tükenmez Nimet', ayahCount: 3, revelationType: 'Mekke' },
  { id: 109, name: 'Kâfirûn', arabicName: 'الكافرون', transliteration: 'Al-Kafirun', translation: 'İnkârcılar', ayahCount: 6, revelationType: 'Mekke' },
  { id: 110, name: 'Nasr', arabicName: 'النصر', transliteration: 'An-Nasr', translation: 'Zafer ve Yardım', ayahCount: 3, revelationType: 'Medine' },
  { id: 112, name: 'İhlâs', arabicName: 'الإخلاص', transliteration: 'Al-Ikhlas', translation: 'Samimiyet ve Tevhid', ayahCount: 4, revelationType: 'Mekke' },
  { id: 113, name: 'Felak', arabicName: 'الفلق', transliteration: 'Al-Falaq', translation: 'Sabahın Aydınlığı', ayahCount: 5, revelationType: 'Mekke' },
  { id: 114, name: 'Nâs', arabicName: 'الناس', transliteration: 'An-Nas', translation: 'İnsanlar', ayahCount: 6, revelationType: 'Mekke' }
];

export interface SurahDetailContent {
  surahId: number;
  verses: {
    number: number;
    arabic: string;
    transcription: string;
    translation: string;
  }[];
}

export const POPULAR_SURAH_CONTENTS: Record<number, SurahDetailContent> = {
  1: {
    surahId: 1,
    verses: [
      {
        number: 1,
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        transcription: 'Bismillâhir-rahmânir-rahîm.',
        translation: 'Rahmân ve Rahîm olan Allah’ın adıyla.'
      },
      {
        number: 2,
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transcription: 'El-hamdü lillâhi rabbil-âlemîn.',
        translation: 'Hamd, âlemlerin Rabbi olan Allah’a mahsustur.'
      },
      {
        number: 3,
        arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        transcription: 'Er-rahmânir-rahîm.',
        translation: 'O, Rahmândır, Rahîmdir.'
      },
      {
        number: 4,
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        transcription: 'Mâliki yevmid-dîn.',
        translation: 'Ceza ve mükâfat gününün (ahiretin) yegâne sahibidir.'
      },
      {
        number: 5,
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        transcription: 'İyyâke na’büdü ve iyyâke neste’în.',
        translation: '(Rabbimiz!) Yalnız sana kulluk eder ve yalnız senden yardım dileriz.'
      },
      {
        number: 6,
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        transcription: 'İhdinas-sırâtal-müstekîm.',
        translation: 'Bizi doğru yola ilet;'
      },
      {
        number: 7,
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        transcription: 'Sırâtallezîne en’amte aleyhim, gayril-mağdûbi aleyhim veled-dâllîn.',
        translation: 'Kendilerine lütuf ve ihsanda bulunduğun kimselerin yoluna; gazaba uğramışların ve sapmışların yoluna değil! (Âmin)'
      }
    ]
  },
  94: {
    surahId: 94,
    verses: [
      {
        number: 1,
        arabic: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ',
        transcription: 'Elem neşrah leke sadrak.',
        translation: 'Biz senin göğsünü (kalbini genişletip ferahlatmadık) açmadık mı?'
      },
      {
        number: 2,
        arabic: 'وَوَضَعْنَا عَنكَ وِزْرَكَ',
        transcription: 'Ve veda’nâ anke vizrak.',
        translation: 'Ve belini büken ağır yükünü üzerinden indirmedik mi?'
      },
      {
        number: 3,
        arabic: 'الَّذِي أَنقَضَ ظَهْرَكَ',
        transcription: 'Ellezî enkada zahrak.',
        translation: 'O yük ki senin belini bükmüştü.'
      },
      {
        number: 4,
        arabic: 'وَرَفَعْنَا لَكَ ذِكْرَكَ',
        transcription: 'Ve refa’nâ leke zikrak.',
        translation: 'Senin şanını ve namını yüceltmedik mi?'
      },
      {
        number: 5,
        arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
        transcription: 'Fe-inne meal-usri yusrâ.',
        translation: 'Şüphesiz her zorlukla beraber bir kolaylık vardır.'
      },
      {
        number: 6,
        arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
        transcription: 'İnne meal-usri yusrâ.',
        translation: 'Evet, elbette zorlukla beraber bir kolaylık vardır.'
      },
      {
        number: 7,
        arabic: 'فَإِذَا فَرَغْتَ فَانصَبْ',
        transcription: 'Fe-izâ ferağte fensab.',
        translation: 'O halde bir işi bitirince hemen diğerine koyul ve yorul.'
      },
      {
        number: 8,
        arabic: 'وَإِلَىٰ رَبِّكَ فَارْغَب',
        transcription: 'Ve ilâ rabbike ferğab.',
        translation: 'Ve ancak Rabbine yönel, O’na rağbet et.'
      }
    ]
  },
  112: {
    surahId: 112,
    verses: [
      {
        number: 1,
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        transcription: 'Kul hüvallâhu ehad.',
        translation: 'De ki: O Allah tektir.'
      },
      {
        number: 2,
        arabic: 'اللَّهُ الصَّمَدُ',
        transcription: 'Allâhüs-samed.',
        translation: 'Allah Samed’dir (Her şey O’na muhtaç, O hiçbir şeye muhtaç değildir).'
      },
      {
        number: 3,
        arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        transcription: 'Lem yelid ve lem yûled.',
        translation: 'O, doğurmamış ve doğmamıştır.'
      },
      {
        number: 4,
        arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        transcription: 'Ve lem yekün lehû küfüven ehad.',
        translation: 'Hiçbir şey O’na denk ve benzer değildir.'
      }
    ]
  },
  113: {
    surahId: 113,
    verses: [
      {
        number: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        transcription: 'Kul e’ûzü bi-rabbil-felak.',
        translation: 'De ki: Sabahın Rabbine sığınırım;'
      },
      {
        number: 2,
        arabic: 'مِن شَرِّ مَا خَلَقَ',
        transcription: 'Min şerri mâ halak.',
        translation: 'Yarattığı şeylerin şerrinden,'
      },
      {
        number: 3,
        arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        transcription: 'Ve min şerri gâsikın izâ vekab.',
        translation: 'Karanlığı çöktüğü zaman gecenin şerrinden,'
      },
      {
        number: 4,
        arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
        transcription: 'Ve min şerrin-neffâsâti fil-ukad.',
        translation: 'Düğümlere üfleyen büyücülerin şerrinden,'
      },
      {
        number: 5,
        arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        transcription: 'Ve min şerri hâsidin izâ hased.',
        translation: 'Ve haset ettiği vakit kıskanç kişinin şerrinden!'
      }
    ]
  },
  114: {
    surahId: 114,
    verses: [
      {
        number: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        transcription: 'Kul e’ûzü bi-rabbin-nâs.',
        translation: 'De ki: İnsanların Rabbine sığınırım,'
      },
      {
        number: 2,
        arabic: 'مَلِكِ النَّاسِ',
        transcription: 'Melikin-nâs.',
        translation: 'İnsanların mutlak Melik’ine (hükümdarına),'
      },
      {
        number: 3,
        arabic: 'إِلَٰهِ النَّاسِ',
        transcription: 'İlâhin-nâs.',
        translation: 'İnsanların yegâne İlahı olan Allah’a;'
      },
      {
        number: 4,
        arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
        transcription: 'Min şerril-vesvâsil-hannâs.',
        translation: 'O sinsi vesvesecinin (şeytanın) şerrinden,'
      },
      {
        number: 5,
        arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
        transcription: 'Ellezî yüvesvisü fî sudûrin-nâs.',
        translation: 'Ki o, insanların kalplerine sürekli vesvese fısıldar;'
      },
      {
        number: 6,
        arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
        transcription: 'Minel-cinneti ven-nâs.',
        translation: 'Gerek cinlerden gerekse insanlardan olan vesvesecilerin şerrinden!'
      }
    ]
  }
};

// Initial state for 30 Juz
export function getInitialHatimProgress(): JuzProgress[] {
  return Array.from({ length: 30 }, (_, i) => ({
    juzNumber: i + 1,
    isCompleted: false,
    readPages: 0,
    readerName: ''
  }));
}

export const HATIM_DUASI = {
  title: 'Kur’an-ı Kerim Hatim Duası',
  arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ أَجْمَعِينَ. اللَّهُمَّ رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ...',
  turkish: `Elhamdülillâhi Rabbi'l-âlemîn. Ve's-salâtü ve's-selâmü alâ Rasûlinâ Muhammedin ve alâ âlihî ve sahbihî ecmaîn.
  
Ey âlemleri yoktan var eden, kalpleri Kur'an nuruyla aydınlatan Yüce Rabbimiz!
Okumuş olduğumuz hatm-i şerifi dergâh-ı izzetinde en güzel şekilde kabul eyle.
Hâsıl olan sevabı evvelâ bizzat sevgilin, habibin Hz. Muhammed Mustafa (s.a.v.) Efendimiz'in pak ruh-ı şeriflerine hediye eyledik, vasıl eyle.
Bütün peygamberlerin, ashab-ı kiramın, din büyüklerimizin ve geçmişlerimizin ruhlarına bağışladık, haberdar eyle.
Hatim halkamıza katılan, okuyan ve dinleyen kardeşlerimizin günahlarını af, ibadetlerini makbul, yuvalarını huzurlu ve bereketli eyle.
Bizi Kur'an ahlakıyla ahlaklandır, son nefesimizde Kur'an ve iman ile çene kapamayı nasip eyle.
Âmin, bi-hürmeti seyyidi'l-mürselîn, ve'l-hamdü lillâhi Rabbi'l-âlemîn.`
};
