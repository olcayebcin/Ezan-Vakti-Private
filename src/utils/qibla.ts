export interface QiblaResult {
  qiblaAngle: number; // 0 to 360 degrees from North
  distanceKm: number; // distance to Mecca in km
  directionDescription: string;
}

const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

export function calculateQibla(userLat: number, userLng: number): QiblaResult {
  const phi1 = rad(userLat);
  const phi2 = rad(KAABA_LAT);
  const deltaLambda = rad(KAABA_LNG - userLng);

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);

  let qiblaRad = Math.atan2(y, x);
  let qiblaDeg = (deg(qiblaRad) + 360) % 360;

  // Haversine formula for distance
  const R = 6371; // Earth radius in km
  const dLat = phi2 - phi1;
  const dLng = deltaLambda;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);

  let directionDescription = 'Güneydoğu';
  if (qiblaDeg >= 337.5 || qiblaDeg < 22.5) directionDescription = 'Kuzey';
  else if (qiblaDeg >= 22.5 && qiblaDeg < 67.5) directionDescription = 'Kuzeydoğu';
  else if (qiblaDeg >= 67.5 && qiblaDeg < 112.5) directionDescription = 'Doğu';
  else if (qiblaDeg >= 112.5 && qiblaDeg < 157.5) directionDescription = 'Güneydoğu';
  else if (qiblaDeg >= 157.5 && qiblaDeg < 202.5) directionDescription = 'Güney';
  else if (qiblaDeg >= 202.5 && qiblaDeg < 247.5) directionDescription = 'Güneybatı';
  else if (qiblaDeg >= 247.5 && qiblaDeg < 292.5) directionDescription = 'Batı';
  else if (qiblaDeg >= 292.5 && qiblaDeg < 337.5) directionDescription = 'Kuzeybatı';

  return {
    qiblaAngle: Math.round(qiblaDeg * 10) / 10,
    distanceKm,
    directionDescription,
  };
}
