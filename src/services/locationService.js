export const detectUserLocation = () => new Promise((resolve, reject) => {
  if (!navigator.geolocation) {
    reject({ code: 'unsupported' });
    return;
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => resolve({
      latitude: coords.latitude,
      longitude: coords.longitude,
      status: 'detected'
    }),
    (error) => {
      const codes = { 1: 'denied', 2: 'unavailable', 3: 'timeout' };
      reject({ code: codes[error.code] || 'unavailable' });
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
  );
});

export const formatCoordinates = (value) => (
  typeof value === 'number' ? value.toFixed(6) : '-'
);
