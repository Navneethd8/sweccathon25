"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";

export default function Home() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const totalLeaves = 30;
    const newLeaves = Array.from({ length: totalLeaves }).map((_, index) => ({
      id: index,
      left: Math.random() * 100,
      size: 20 + Math.random() * 30,
      delay: Math.random() * 10,
      duration: 5 + Math.random() * 5,
      rotate: Math.random() * 360,
    }));
    setLeaves(newLeaves);
  }, []);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-no-repeat bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: 'url("/etst.svg")' }}
    >
      <Navbar />
      <div className="text-center px-6 md:px-10 z-30">
        <div className="inline-block bg-[#DFEFE3]/70 backdrop-blur-md rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl md:text-5xl font-bold text-[#4B2E83] mb-4">
            Missed the U District Food Walk?
          </h1>
          <p className="text-lg md:text-2xl text-[#4B2E83]">
            Try out this mini bingo game that covers it for you!
          </p>
        </div>
      </div>

      {/* Cherry blossom leaves */}
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute top-[-10%]"
          style={{
            left: `${leaf.left}%`,
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
            animation: `fall ${leaf.duration}s linear infinite`,
            animationDelay: `${leaf.delay}s`,
            transform: `rotate(${leaf.rotate}deg)`,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <img
            src="/maple-leaf.svg"
            alt="maple leaf"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      ))}

      {/* CSS for falling animation */}
      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(120vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
