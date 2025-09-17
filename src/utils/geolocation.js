export const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ lat: latitude, lng: longitude });
          },
          (error) => {
            reject('Geolocation error: ' + error.message);
          }
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  };
  