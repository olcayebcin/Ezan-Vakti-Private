import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { 
  X, 
  Smartphone, 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Download, 
  Share2, 
  AlertTriangle,
  Radio,
  CheckCircle2
} from 'lucide-react';

interface ApkInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const ApkInstallModal: React.FC<ApkInstallModalProps> = ({
  isOpen,
  onClose,
  isDark
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // The active running development server URL (Live on Google Cloud Run right now)
  const devUrl = 'https://ais-dev-ghni2dpc33d6lbhbvz4ptf-156751802979.europe-west2.run.app';
  // The shared / preview URL (Active after clicking "Share" / "Publish" in AI Studio)
  const sharedUrl = 'https://ais-pre-ghni2dpc33d6lbhbvz4ptf-156751802979.europe-west2.run.app';

  // Determine current active URL dynamically
  const initialUrl = typeof window !== 'undefined' && window.location.origin.includes('ais-dev')
    ? window.location.origin
    : devUrl;

  const [selectedUrlType, setSelectedUrlType] = useState<'dev' | 'shared'>('dev');
  const [activeUrl, setActiveUrl] = useState<string>(initialUrl);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const url = selectedUrlType === 'dev' ? initialUrl : sharedUrl;
    setActiveUrl(url);

    if (isOpen) {
      QRCode.toDataURL(url, {
        width: 300,
        margin: 1.5,
        color: {
          dark: '#0a1017',
          light: '#ffffff',
        },
      })
        .then((dataUrl) => setQrDataUrl(dataUrl))
        .catch((err) => console.error('QR code error:', err));
    }
  }, [isOpen, selectedUrlType, initialUrl, sharedUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Namaz Vakti',
          text: 'Namaz vakitleri, ezan makamları, kıble pusulası ve sesli Kur’an-ı Kerim uygulaması:',
          url: activeUrl,
        });
      } catch (err) {
        console.debug(err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-lg rounded-3xl flex flex-col max-h-[92vh] overflow-hidden shadow-2xl border transition-all ${
          isDark ? 'bg-[#0c1117] border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Android APK & Mobil Bağlantı</h2>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Telefonunuzda Deneyin & Ana Ekrana Kurun
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Explanation Alert for 404 "Page not found" */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-amber-400 block">
                "Page not found" Hatası Hakkında Bilgilendirme:
              </span>
              <p className="text-neutral-300 leading-relaxed text-[11px] sm:text-xs">
                Önceki link (<code>ais-pre</code>), AI Studio panelinin sağ üst köşesindeki <strong>"Share / Paylaş"</strong> butonuna basılana kadar henüz oluşturulmamıştır.
                Aşağıdaki <strong>Canlı Çalışan Bağlantı (ais-dev)</strong> şu anda açık ve yayındadır!
              </p>
            </div>
          </div>

          {/* New Camili App Icon Preview */}
          <div className={`p-3.5 rounded-2xl border flex items-center gap-3.5 ${
            isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
          }`}>
            <div className="relative group flex-shrink-0">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 opacity-40 blur group-hover:opacity-75 transition duration-300" />
              <img
                src="/icon.svg"
                alt="Namaz Vakti Camili İkon"
                className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shadow-xl object-cover border border-amber-500/40"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-bold truncate">Namaz Vakti & Ezan</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
                  Yeni İkon
                </span>
              </div>
              <p className={`text-[11px] mt-0.5 leading-tight ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Altın varak kubbeli & minareli gece camisi tasarımı Android ana ekranınıza eklendi.
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
            <button
              onClick={() => setSelectedUrlType('dev')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedUrlType === 'dev'
                  ? 'bg-amber-500 text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Canlı Sunucu (Aktif)</span>
            </button>

            <button
              onClick={() => setSelectedUrlType('shared')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedUrlType === 'shared'
                  ? 'bg-amber-500 text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Paylaşım Linki</span>
            </button>
          </div>

          {/* QR Code Section */}
          <div className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center ${
            isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
          }`}>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500 mb-2">
              <QrCode className="w-4 h-4" />
              <span>Telefon Kamerasıyla Okutun:</span>
            </div>

            {/* QR Image Container */}
            <div className="p-3 bg-white rounded-2xl shadow-lg border border-neutral-300 inline-block">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Namaz Vakti Mobil Yükleme QR Kodu"
                  className="w-44 h-44 sm:w-48 sm:h-48 object-contain"
                />
              ) : (
                <div className="w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center text-xs text-neutral-400">
                  QR Kod Üretiliyor...
                </div>
              )}
            </div>

            <p className="text-[11px] text-neutral-400 mt-2.5 max-w-xs">
              {selectedUrlType === 'dev' 
                ? 'Şu anda çalışan canlı geliştirme adresidir. Telefonunuzun kamerasıyla anında açılır.' 
                : 'AI Studio sağ üstündeki "Share" butonuna basarak bu adresi herkese açabilirsiniz.'}
            </p>
          </div>

          {/* Direct Link & Copy */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-neutral-400 font-medium">Doğrudan Mobil Adres:</span>
            <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
              isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
            }`}>
              <span className="text-xs font-mono truncate text-amber-400/90 pl-1 select-all">
                {activeUrl}
              </span>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={handleCopyLink}
                  className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Bağlantıyı kopyala"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copied ? 'Kopyalandı!' : 'Kopyala'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className={`p-1.5 sm:px-2 sm:py-1.5 rounded-lg border text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                    isDark 
                      ? 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-200' 
                      : 'border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700'
                  }`}
                  title="Paylaş"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Paylaş</span>
                </button>
              </div>
            </div>
          </div>

          {/* In-Browser Direct Install Button (if on mobile or compatible browser) */}
          {isInstallable && (
            <button
              onClick={install}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Telefonunuza Şimdi Yükleyin (Tek Tıkla APK)</span>
            </button>
          )}

          {isInstalled && (
            <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Uygulama başarıyla cihazınıza yüklendi!</span>
            </div>
          )}

          {/* 3 Step Android WebAPK Installation */}
          <div className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
            isDark ? 'bg-neutral-950/50 border-neutral-800 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-700'
          }`}>
            <div className="flex items-center gap-1.5 font-bold text-amber-500 text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Telefonda APK Olarak Ana Ekrana Nasıl Eklenir?</span>
            </div>

            <ol className="space-y-1 pl-4 list-decimal text-[11px] text-neutral-400">
              <li>
                Telefonunuzun kamerasını QR koda tutun veya linki <strong>Chrome</strong>'da açın.
              </li>
              <li>
                Chrome sağ üstteki <strong>⋮ (üç nokta)</strong> menüsüne dokunup <strong>"Uygulamayı Yükle"</strong> (veya <em>"Ana ekrana ekle"</em>) seçin.
              </li>
              <li>
                Android sistemi yeni altın camili ikonuyla uygulamayı tam bir APK gibi ana ekranınıza ve uygulama çekmecenize yerleştirir.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
