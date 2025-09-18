'use client';

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { locations as initialLocations } from "../data/locations";
import LocationCard from "../components/LocationCard";
import LoadingScreen from "../components/Loading"; 
import AppNavbar from "../components/appNavbar";

export default function Dashboard() {
  const [locationsWithPhotos, setLocationsWithPhotos] = useState([]);
  const [checkedInLocations, setCheckedInLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    
  useEffect(() => {
    const loadLocationsWithPhotos = async () => {
      setLoading(true);
      setError(null);
      try {
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
            setSelectedLocations(storedIds)
            randomLocations = data.filter(location => storedIds.includes(location.id));
          } else {
            const shuffled = data
              .map(value => ({ value, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ value }) => value);
  
            randomLocations = shuffled.slice(0, 9);
  
            await setDoc(userDocRef, {
              selectedLocations: randomLocations.map(loc => loc.id)
            }, { merge: true });
          }
  
          setLocationsWithPhotos(randomLocations);
  
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

  if (loading) {
    return <LoadingScreen />; 
  }

  if (error) {
    return <p>Error Fetching Data!</p>;
  }

  const totalLocations = selectedLocations.length;
  const progress = (checkedInLocations.length / totalLocations) * 100;

  return (
<div className="min-h-screen flex flex-col bg-[var(--page-background)]">
  {/* Navbar row */}
  <div className="fixed top-0 left-0 w-full z-50">
    <AppNavbar />
  </div>

  {/* Progress bar + profile row */}
  <div className="fixed top-16 left-0 w-full z-40 px-6 py-10 bg-[var(--et)] backdrop-blur-md shadow-md flex items-center justify-between">
    <div className="flex-1 h-3 bg-[#BEDFC8] rounded-full overflow-hidden mx-4">
      <div
        className="h-full bg-[var(--foreground)] transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>

  {/* Content grid */}
  <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6  mt-50 flex-grow">
    {locationsWithPhotos.map((location) => (
      <LocationCard key={location.id} location={location} />
    ))}
  </div>
</div>
  );
}
