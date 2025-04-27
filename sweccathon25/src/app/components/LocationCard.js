'use client';

import { useRouter } from 'next/navigation'; // Use the useRouter hook for programmatic navigation
import Image from 'next/image';

export default function LocationCard({ location }) {
  const router = useRouter(); // Initialize the router

  const handleNavigate = () => {
    // Navigate to the location detail page using router.push
    router.push(`/location/${location.id}`);
  };

  return (
    <div 
      onClick={handleNavigate} 
      className="relative bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:scale-105 cursor-pointer flex flex-col"
    >
      {/* Image */}
      <div className="w-full h-50 relative">
        {location.image && (
          <Image
            src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${encodeURIComponent(location.image)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
            alt={location.name}
            fill
            style={{ objectFit: "cover" }}
            onError={(e) => {
              console.error("Error loading image for", location.name, e);
              // Optionally display a fallback image here
            }}
          />
        )}
        {!location.image && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-200 flex items-center justify-center">
            No Image Available
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold text-[#4B2E83]">{location.name}</h2>
      </div>
    </div>
  );
}
