'use client';

import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { locations as initialLocations } from "../data/locations";
import LocationCard from "../components/LocationCard";
import Image from "next/image";
import Link from "next/link";
import LoadingScreen from "../components/Loading"; // Import the LoadingScreen component

export default function Dashboard() {
  const [profilePic, setProfilePic] = useState("");
  const [locationsWithPhotos, setLocationsWithPhotos] = useState([]);
  const [checkedInLocations, setCheckedInLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's profile picture
  useEffect(() => {
    const fetchProfilePicture = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfilePic(data.profilePicture);
        }
      }
    };
    fetchProfilePicture();
  }, []);

  // Fetch locations with photos and check-in data
  useEffect(() => {
    const loadLocationsWithPhotos = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch locations with photos
        const response = await fetch('/api/getPlacePhotoReferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locations: initialLocations }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch location photo references from the server.');
        }
  
        const data = await response.json();
        setLocationsWithPhotos(data);
  
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "Users", user.uid);
          const userDoc = await getDoc(userDocRef);
  
          let randomLocations = [];
  
          if (userDoc.exists() && userDoc.data().selectedLocations) {
            // Use stored selection
            const storedIds = userDoc.data().selectedLocations;
            randomLocations = data.filter(location => storedIds.includes(location.id));
          } else {
            // Shuffle and pick 9 locations
            const shuffled = data
              .map(value => ({ value, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ value }) => value);
  
            randomLocations = shuffled.slice(0, 9);
  
            // Save selection to Firestore
            await setDoc(userDocRef, {
              selectedLocations: randomLocations.map(loc => loc.id)
            }, { merge: true });
          }
  
          setLocationsWithPhotos(randomLocations);
  
          // Also fetch checked-in locations if any
          setCheckedInLocations(userDoc.exists() ? (userDoc.data().checkedInLocations || []) : []);
        }
  
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLocationsWithPhotos();
  }, []);

  // Show loading screen while data is fetching
  if (loading) {
    return <LoadingScreen />; // Use the LoadingScreen component for the loading view
  }

  if (error) {
    return <p>Error Fetching Data!</p>;
  }

  // Calculate the progress percentage based on checked-in locations
  const totalLocations = initialLocations.length;
  const progress = (checkedInLocations.length / totalLocations) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFB7C5]">
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md shadow-md">
        {/* Progress bar */}
        <div className="flex-1 h-3 bg-gray-300 rounded-full overflow-hidden mx-4">
          <div
            className="h-full bg-[#4B2E83]"
            style={{ width: `${progress}%` }} // Dynamically update progress based on checked-in locations
          />
        </div>

        {/* Profile Picture */}
        <Link href="/profile">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#4B2E83] cursor-pointer">
            {profilePic ? (
              <Image
                src={profilePic}
                alt="Profile"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="bg-gray-300 w-full h-full flex items-center justify-center text-sm text-gray-600">
                ?
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Location Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6 flex-grow">
        {locationsWithPhotos.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
    </div>
  );
}
