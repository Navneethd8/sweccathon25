'use client';

import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/firebase'; // Firebase config
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getCurrentPosition } from '../../../utils/geolocation'; // Custom geolocation hook
import { locations as initialLocations } from '../../data/locations'; // Import locations from data/locations.js
import { useRouter } from 'next/navigation';
import LoadingScreen from '../../components/Loading'; // Import LoadingScreen component

const LocationDetail = ({ params }) => {
  const router = useRouter();
  const { id } = React.use(params); // Unwrap params using React.use
  const user = auth.currentUser;
  const [location, setLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [photoReference, setPhotoReference] = useState(null);
  const [loadingPhoto, setLoadingPhoto] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('useEffect triggered for params.id:', id);

    // Check the type of id
    console.log('Type of id from params:', typeof id);

    if (id) {
      // Ensure both sides of the comparison are the same type
      const locationDetails = initialLocations.find((loc) => loc.id === parseInt(id)); // Ensure both id and loc.id are numbers
      if (locationDetails) {
        console.log('Location found:', locationDetails);
        setLocation(locationDetails);
        fetchLocationPhoto(locationDetails);
      } else {
        console.log('Location not found for id:', id);
        router.push("/dashboard");
      }
    }
  }, [id]);

  // Fetch location photo reference
  const fetchLocationPhoto = async (location) => {
    console.log('Fetching photo for location:', location);
    setLoadingPhoto(true);
    setError(null);
    try {
      const response = await fetch('/api/getPlacePhotoReferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locations: [location] }),
      });

      console.log('API response status:', response.status);
      if (!response.ok) {
        throw new Error('Failed to fetch location photo references from the server.');
      }

      const data = await response.json();
      console.log('API response data:', data);
      setPhotoReference(data[0]?.image || null); // Set the correct image reference
    } catch (err) {
      console.error('Error fetching photo:', err);
      setError('Failed to load location photo.');
    } finally {
      setLoadingPhoto(false);
    }
  };

  useEffect(() => {
    console.log('Checking user check-in status...');
    if (user && location) {
      checkUserCheckIn(); // Check if the user has already checked in
    }
  }, [user, location]);

  const checkUserCheckIn = async () => {
    console.log('Checking if user has checked into this location...');
    const userDocRef = doc(db, 'Users', user.uid);
    const userData = await getDoc(userDocRef);
    const checkedInLocations = userData.data()?.checkedInLocations || [];
    setIsCheckedIn(checkedInLocations.includes(location?.id)); // Check if location is already checked-in
    console.log('Checked-in locations:', checkedInLocations);
    console.log('Is checked-in:', checkedInLocations.includes(location?.id));
  };

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Radius of the Earth in meters
    const φ1 = lat1 * (Math.PI / 180); // Latitude in radians
    const φ2 = lat2 * (Math.PI / 180); // Latitude in radians
    const Δφ = (lat2 - lat1) * (Math.PI / 180); // Latitude difference in radians
    const Δλ = (lon2 - lon1) * (Math.PI / 180); // Longitude difference in radians

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters

    return distance;
  };

  const handleCheckIn = async () => {
    console.log('Handling check-in...');
    
    // Attempt to get the user location
    const position = await getCurrentPosition();
    if (!position) {
      alert('Unable to retrieve location. Please try again.');
      console.log('Error retrieving user location');
      router.push("/dashboard");
    }

    // Set user location
    setUserLocation(position);
    console.log('User location retrieved:', position);

    // Use the Haversine formula to calculate the distance
    const distance = calculateDistance(position.lat, position.lng, location.lat, location.lng);
    console.log('Distance from location:', distance, 'meters');

    // Check if user is within 10 meters of the location
    if (distance > 10) {
      alert('You are too far from the location to check in!');
      console.log('User is too far from the location');
      router.push("/dashboard");
    }
    else{
        const userDocRef = doc(db, 'Users', user.uid);
        await updateDoc(userDocRef, {
        checkedInLocations: arrayUnion(location.id),
        });

        setIsCheckedIn(true); // Mark location as checked-in
        alert('Check-in successful!');
        console.log('User checked-in successfully');
        router.push("/dashboard");

    }

  };

  if (loadingPhoto) {
    console.log('Loading location photo...');
    return <LoadingScreen />; // Use the LoadingScreen component for the loading view
  }

  if (error) {
    console.log('Error occurred:', error);
    return <p>{error}</p>;
  }

  console.log('Rendering LocationDetail with location:', location);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFB7C5]">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-10 w-full max-w-md shadow-lg flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-[#4B2E83] mb-6 text-center">{location?.name}</h1>

        {/* Image fetched from API using the photo reference */}
        {photoReference && (
          <div className="mb-6">
            <img
              src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${encodeURIComponent(photoReference)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
              alt={location?.name}
              className="rounded-lg mb-6"
            />
          </div>
        )}

        <p className="text-center mb-6">{location?.funFact}</p>

        {/* Check-In Button */}
        <button
          onClick={handleCheckIn}
          className={`bg-[#4B2E83] text-white rounded-full py-3 px-8 mt-4 hover:bg-[#362366] transition ${isCheckedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isCheckedIn}
        >
          {isCheckedIn ? 'Already Checked In' : 'Check-In'}
        </button>
      </div>
    </div>
  );
};

export default LocationDetail;
