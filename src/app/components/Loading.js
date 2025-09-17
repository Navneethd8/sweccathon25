'use client';

import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F2F2F2]">
      <div className="text-center">
        {/* Logo Placeholder */}
        <div className="mb-6">
          <Image
            src="/favicon.ico" // Replace with your actual logo path
            alt="Food Walk Bingo Logo"
            width={200} // Adjust width as per your logo
            height={200} // Adjust height as per your logo
          />
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center items-center">
          <div className="animate-spin border-t-4 border-b-4 border-purple-700 border-solid rounded-full w-16 h-16"></div>
        </div>

        {/* Optional text */}
        <p className="mt-4 text-xl font-semibold text-[#4B2E83]">Loading Ave Bingo...</p>
      </div>
    </div>
  );
}
