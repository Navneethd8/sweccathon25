// lib/googleMapsUtils.js

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export const getPlaceDetails = async (placeName) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
        placeName
      )}&inputtype=textquery&fields=place_id&key=${GOOGLE_API_KEY}`
    );
    const data = await response.json();

    if (data.status === 'OK' && data.candidates.length > 0) {
      const placeId = data.candidates[0].place_id;
      const detailsResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_API_KEY}`
      );
      const detailsData = await detailsResponse.json();

      if (detailsData.status === 'OK' && detailsData.result.photos && detailsData.result.photos.length > 0) {
        return detailsData.result.photos[0].photo_reference;
      } else {
        console.warn(`Could not retrieve photos for ${placeName}`);
        return null;
      }
    } else {
      console.warn(`Could not find place ID for ${placeName}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};

export const generatePhotoUrl = (photoReference) => {
  if (photoReference) {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`;
  }
  return null;
};

export const fetchLocationsWithPhotoReferences = async (locations) => {
  const updatedLocations = await Promise.all(
    locations.map(async (location) => {
      const photoReference = await getPlaceDetails(location.name);
      return { ...location, image: photoReference }; // Store the photo_reference here
    })
  );
  return updatedLocations;
};