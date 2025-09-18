'use client';

import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F2F2F2]">
      <div className="text-center">
        {/* Logo Placeholder */}
        <div className="mb-6">
          <Image
            src="/Group 1.png" // Replace with your actual logo path
            alt="ET Logo"
            width={300} // Adjust width as per your logo
            height={300} // Adjust height as per your logo
          />
        </div>
      </div>
    </div>
  );
}
