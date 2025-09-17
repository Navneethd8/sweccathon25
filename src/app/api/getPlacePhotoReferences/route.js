export async function POST(request) {
  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { locations } = await request.json();

  // Check if locations is valid (either a single location object or an array of locations)
  if (!locations || (Array.isArray(locations) && locations.length === 0) || (typeof locations !== 'object')) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // If a single location is passed, convert it into an array to process uniformly
  const locationsArray = Array.isArray(locations) ? locations : [locations];

  try {
    const updatedLocations = await Promise.all(
      locationsArray.map(async (location) => {
        try {
          const findPlaceResponse = await fetch(
            `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
              location.name
            )}&inputtype=textquery&fields=place_id&key=${GOOGLE_API_KEY}`
          );
          const findPlaceData = await findPlaceResponse.json();

          if (findPlaceData.status === 'OK' && findPlaceData.candidates.length > 0) {
            const placeId = findPlaceData.candidates[0].place_id;
            const detailsResponse = await fetch(
              `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_API_KEY}`
            );
            const detailsData = await detailsResponse.json();

            if (detailsData.status === 'OK' && detailsData.result.photos && detailsData.result.photos.length > 0) {
              return { ...location, image: detailsData.result.photos[0].photo_reference };
            } else {
              console.warn(`Could not retrieve photos for ${location.name}`);
              return { ...location, image: null };
            }
          } else {
            console.warn(`Could not find place ID for ${location.name}`);
            return { ...location, image: null };
          }
        } catch (error) {
          console.error(`Error fetching details for ${location.name}:`, error);
          return { ...location, image: null };
        }
      })
    );

    return new Response(JSON.stringify(updatedLocations), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing locations:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch photo references' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
