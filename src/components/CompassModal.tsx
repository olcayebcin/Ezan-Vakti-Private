import React, { useState, useEffect } from 'react';
import { calculateQibla } from '../utils/qibla';
import { CityData } from '../types/prayer';
import { X, Compass, CheckCircle2, RotateCw, AlertCircle } from 'lucide-react';

interface CompassModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: CityData;
  isDark: boolean;
}

export const CompassModal: React.FC<CompassModalProps> = ({
  isOpen,
  onClose,
  city,
  isDark
}) => {
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [hasCompassSensor, setHasCompassSensor] = useState<boolean>(false);
  const [sensorPermissionRequested, setSensorPermissionRequested] = useState<boolean>(false);
  const [manualHeading, setManualHeading] = useState<number>(0);

  const qiblaData = calculateQibla(city.lat, city.lng);

  useEffect(() => {
    if (!isOpen) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      // iOS webkitCompassHeading vs Android standard alpha
      let heading = 0;
      const webkitEvent = e as unknown as { webkitCompassHeading?: number };
      if (typeof webkitEvent.webkitCompassHeading !== 'undefined') {
        heading = webkitEvent.webkitCompassHeading;
        setHasCompassSensor(true);
      } else if (e.alpha !== null) {
        heading = (360 - e.alpha) % 360;
        setHasCompassSensor(true);
      }
      setDeviceHeading(heading);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, [isOpen]);

  const requestCompassPermission = async () => {
    setSensorPermissionRequested(true);
    const DeviceEvent = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    if (typeof DeviceEvent.requestPermission === 'function') {
      try {
        const response = await DeviceEvent.requestPermission();
        if (response === 'granted') {
          setHasCompassSensor(true);
        }
      } catch (err) {
        console.error('Sensor permission error', err);
      }
    }
  };

  if (!isOpen) return null;

  // Active compass angle is either from sensor or manual calibration
  const activeHeading = hasCompassSensor ? deviceHeading : manualHeading;
  
  // Calculate relative angle to Qibla
  // When device faces Qibla, diff is 0
  const diff = (qiblaData.qiblaAngle - activeHeading + 360) % 360;
  const isAligned = diff <= 4 || diff >= 356;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-sm rounded-3xl flex flex-col items-center overflow-hidden shadow-2xl border transition-all ${
          isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="w-full p-4 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-base font-bold">Kıble Pusulası</h2>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {city.name} İçin Gerçek Kıble Yönü
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="w-full p-6 flex flex-col items-center">
          {/* Target Angle and Status */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-1 border"
              style={{
                borderColor: isAligned ? '#10b981' : '#f59e0b',
                backgroundColor: isAligned ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                color: isAligned ? '#10b981' : '#f59e0b'
              }}
            >
              {isAligned ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Kıble Yönündesiniz (Doğru Açı)</span>
                </>
              ) : (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Kıble Açısı: {qiblaData.qiblaAngle}° ({qiblaData.directionDescription})</span>
                </>
              )}
            </div>
            <p className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Mekke-i Mükerreme'ye mesafe: <span className="font-semibold text-amber-500">{qiblaData.distanceKm.toLocaleString('tr-TR')} km</span>
            </p>
          </div>

          {/* Compass Dial Graphic */}
          <div className="relative w-64 h-64 my-2 flex items-center justify-center select-none">
            {/* Outer ring */}
            <div 
              className={`absolute inset-0 rounded-full border-2 transition-all ${
                isAligned 
                  ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.35)]' 
                  : isDark 
                    ? 'border-neutral-700 shadow-[0_0_20px_rgba(0,0,0,0.5)]' 
                    : 'border-neutral-300 shadow-[0_0_20px_rgba(0,0,0,0.08)]'
              }`}
            />

            {/* Degree Tick marks */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 256 256">
              {Array.from({ length: 36 }).map((_, i) => {
                const angle = i * 10;
                const isMajor = angle % 90 === 0;
                const isMedium = angle % 30 === 0;
                const r1 = 124;
                const r2 = isMajor ? 106 : isMedium ? 112 : 117;
                const rad = (angle * Math.PI) / 180;
                const x1 = 128 + r1 * Math.sin(rad);
                const y1 = 128 - r1 * Math.cos(rad);
                const x2 = 128 + r2 * Math.sin(rad);
                const y2 = 128 - r2 * Math.cos(rad);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isMajor ? '#f59e0b' : isDark ? '#525252' : '#a3a3a3'}
                    strokeWidth={isMajor ? 2.5 : isMedium ? 1.5 : 1}
                  />
                );
              })}
            </svg>

            {/* Rotating dial containing Cardinal directions & Kaaba pointer */}
            <div 
              className="absolute inset-2 rounded-full transition-transform duration-200 ease-out flex items-center justify-center"
              style={{ transform: `rotate(${-activeHeading}deg)` }}
            >
              {/* North Pointer */}
              <div className="absolute top-2 text-xs font-bold text-red-500">K (N)</div>
              {/* East */}
              <div className="absolute right-3 text-xs font-medium text-neutral-400">D (E)</div>
              {/* South */}
              <div className="absolute bottom-3 text-xs font-medium text-neutral-400">G (S)</div>
              {/* West */}
              <div className="absolute left-3 text-xs font-medium text-neutral-400">B (W)</div>

              {/* Kaaba Direction Marker on the dial */}
              <div 
                className="absolute inset-0 flex flex-col items-center pointer-events-none"
                style={{ transform: `rotate(${qiblaData.qiblaAngle}deg)` }}
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-950 border-2 border-amber-400 flex items-center justify-center shadow-lg -mt-1 scale-110">
                  {/* Kaaba Silhouette */}
                  <span className="text-xs">🕋</span>
                </div>
                <div className="w-0.5 h-16 bg-gradient-to-b from-amber-400 to-transparent mt-0.5" />
              </div>
            </div>

            {/* Fixed Central Needle / Sight line pointing straight ahead */}
            <div className="absolute w-1 h-24 bg-gradient-to-t from-transparent via-emerald-400 to-emerald-500 -top-2 rounded-full z-10 pointer-events-none" />
            <div className="absolute w-6 h-6 rounded-full bg-amber-500 border-2 border-white shadow-md z-20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-neutral-900" />
            </div>
          </div>

          {/* Device sensor helper & calibration */}
          {!hasCompassSensor && (
            <div className={`mt-3 w-full p-2.5 rounded-xl border text-xs text-center ${
              isDark ? 'bg-neutral-950/60 border-neutral-800 text-neutral-400' : 'bg-neutral-50 border-neutral-200 text-neutral-600'
            }`}>
              <div className="flex items-center justify-center gap-1 text-amber-500 font-medium mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Pusulayı Çevirin veya Kalibre Edin</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={manualHeading}
                onChange={(e) => setManualHeading(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer my-1"
              />
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>0° Kuzey</span>
                <span>{manualHeading}° Cihaz Açısı</span>
                <span>360°</span>
              </div>
            </div>
          )}

          {/* iOS permission trigger if applicable */}
          {!hasCompassSensor && !sensorPermissionRequested && (
            <button
              onClick={requestCompassPermission}
              className="mt-2 text-xs text-amber-500 underline font-medium cursor-pointer"
            >
              Cihaz Hareket Sensörünü Etkinleştir
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
