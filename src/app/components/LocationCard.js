'use client';

import { useRouter } from 'next/navigation'; 
import Image from 'next/image';

export default function LocationCard({ location }) {
  const router = useRouter(); 
  const handleNavigate = () => {
    router.push(`/location/${location.id}`);
  };

  return (
    <div 
      onClick={handleNavigate} 
      className="relative bg-[var(--et)] backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:scale-105 cursor-pointer flex flex-col"
    >
      <div className="w-full relative aspect-[16/9]">
        {location.image && (
          <Image
            src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${encodeURIComponent(location.image)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
            alt={location.name}
            fill
            style={{ objectFit: "cover" }}
            onError={(e) => {
              console.error("Error loading image for", location.name, e);
            }}
          />
        )}
        {!location.image && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-200 flex items-center justify-center">
            No Image Available
          </div>
        )}
      </div>

      <div className="p-4 text-center">
        <h2 className="text-lg font-medium text-[var(--background)]">{location.name}</h2>
      </div>
    </div>
  );
}
