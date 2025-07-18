export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Fixed coordinates for the institute (updated location)
export const INSTITUTE_COORDINATES: Coordinates = {
  latitude: 17.435019,
  longitude: 78.392648
};

// Allowed radius in meters
export const ALLOWED_RADIUS = 500;

// Haversine formula to calculate distance between two points
export const calculateDistance = (
  coord1: Coordinates,
  coord2: Coordinates
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

export const isWithinRadius = (
  userCoordinates: Coordinates,
  instituteCoordinates: Coordinates = INSTITUTE_COORDINATES,
  radius: number = ALLOWED_RADIUS
): boolean => {
  const distance = calculateDistance(userCoordinates, instituteCoordinates);
  console.log(`Distance to institute: ${distance.toFixed(2)} meters`);
  return distance <= radius;
};

export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        console.log('Current location:', coordinates);
        resolve(coordinates);
      },
      (error) => {
        console.error('Geolocation error:', error);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};
