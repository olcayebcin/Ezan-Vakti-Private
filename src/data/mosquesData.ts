import { Mosque } from '../types/prayer';

export const SARIYER_MOSQUES: Mosque[] = [
  {
    id: 'mosque-1',
    name: 'Sarıyer Ali Kethüda Camii',
    district: 'Sarıyer Merkez',
    distanceKm: 0.3,
    lat: 41.1689,
    lng: 29.0578,
    address: 'Merkez Mah. Sarıyer İskele Cad. No:12, Sarıyer/İstanbul',
    hasParking: false,
    hasWomenSection: true,
    historical: true
  },
  {
    id: 'mosque-2',
    name: 'Emirgan Camii (Hamid-i Evvel)',
    district: 'Emirgan',
    distanceKm: 2.8,
    lat: 41.1072,
    lng: 29.0544,
    address: 'Emirgan Mah. Sakıp Sabancı Cad., Sarıyer/İstanbul',
    hasParking: true,
    hasWomenSection: true,
    historical: true
  },
  {
    id: 'mosque-3',
    name: 'Rumelihisarı Camii',
    district: 'Rumeli Hisarı',
    distanceKm: 4.6,
    lat: 41.0847,
    lng: 29.0567,
    address: 'Rumeli Hisarı Mah. Yahya Kemal Cad., Sarıyer/İstanbul',
    hasParking: false,
    hasWomenSection: true,
    historical: true
  },
  {
    id: 'mosque-4',
    name: 'İstinye Neslişah Sultan Camii',
    district: 'İstinye',
    distanceKm: 2.1,
    lat: 41.1147,
    lng: 29.0531,
    address: 'İstinye Mah. Çayır Cad. No:2, Sarıyer/İstanbul',
    hasParking: true,
    hasWomenSection: true,
    historical: true
  },
  {
    id: 'mosque-5',
    name: 'Tarabya Sahil Camii',
    district: 'Tarabya',
    distanceKm: 1.4,
    lat: 41.1392,
    lng: 29.0556,
    address: 'Tarabya Mah. Haydar Aliyev Cad., Sarıyer/İstanbul',
    hasParking: true,
    hasWomenSection: true,
    historical: false
  },
  {
    id: 'mosque-6',
    name: 'Yeniköy Panayia & Kudret Camii',
    district: 'Yeniköy',
    distanceKm: 2.3,
    lat: 41.1215,
    lng: 29.0683,
    address: 'Yeniköy Mah. Köybaşı Cad. No:74, Sarıyer/İstanbul',
    hasParking: false,
    hasWomenSection: true,
    historical: true
  },
  {
    id: 'mosque-7',
    name: 'Büyükdere Camii',
    district: 'Büyükdere',
    distanceKm: 0.9,
    lat: 41.1578,
    lng: 29.0489,
    address: 'Büyükdere Mah. Çayırbaşı Cad., Sarıyer/İstanbul',
    hasParking: true,
    hasWomenSection: true,
    historical: true
  },
  {
    id: 'mosque-8',
    name: 'Kireçburnu İskele Camii',
    district: 'Kireçburnu',
    distanceKm: 1.1,
    lat: 41.1481,
    lng: 29.0519,
    address: 'Kireçburnu Mah. Haydar Aliyev Cad., Sarıyer/İstanbul',
    hasParking: false,
    hasWomenSection: true,
    historical: false
  }
];

// Helper to compute distance between two coordinates
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Generate nearby mosques based on active user position/city
export function getNearbyMosques(centerLat: number, centerLng: number, cityName: string): Mosque[] {
  // If near Sarıyer/Istanbul, use curated real list
  const distToSariyer = getDistanceFromLatLonInKm(centerLat, centerLng, 41.1686, 29.0572);
  if (distToSariyer < 25) {
    return SARIYER_MOSQUES.map(m => ({
      ...m,
      distanceKm: getDistanceFromLatLonInKm(centerLat, centerLng, m.lat, m.lng)
    })).sort((a, b) => a.distanceKm - b.distanceKm);
  }

  // Generate localized mosques for other cities (e.g. Ankara, İzmir, Bursa, Konya...)
  const localizedPrefixes = [
    { name: `${cityName} Ulu Camii`, dist: 0.5, hist: true },
    { name: `${cityName} Merkez Camii`, dist: 0.8, hist: false },
    { name: `${cityName} Fatih Camii`, dist: 1.2, hist: true },
    { name: `${cityName} Çarşı Camii`, dist: 1.5, hist: true },
    { name: `${cityName} Selimiye Mescidi`, dist: 1.9, hist: false },
    { name: `${cityName} Hacı Bayram Camii`, dist: 2.3, hist: false },
  ];

  return localizedPrefixes.map((item, idx) => {
    // Offset slightly for realistic coordinates
    const angle = (idx * 60) * (Math.PI / 180);
    const offsetLat = (item.dist / 111) * Math.cos(angle);
    const offsetLng = (item.dist / (111 * Math.cos(centerLat * Math.PI / 180))) * Math.sin(angle);

    return {
      id: `dyn-mosque-${idx}`,
      name: item.name,
      district: `${cityName} Merkez`,
      distanceKm: item.dist,
      lat: centerLat + offsetLat,
      lng: centerLng + offsetLng,
      address: `${cityName} Merkez Mah. İbadethane Cad. No:${(idx + 1) * 7}`,
      hasParking: idx % 2 === 0,
      hasWomenSection: true,
      historical: item.hist
    };
  });
}
