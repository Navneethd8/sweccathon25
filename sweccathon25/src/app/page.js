"use client";

import { useEffect, useState } from "react";

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
      className="relative min-h-screen w-full overflow-hidden bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: 'url("/etst.svg")' }}
    >
      {/* Navbar */}
      <nav className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/70 backdrop-blur-md rounded-full px-6 py-3 flex gap-6 items-center shadow-md z-50">
        <a
          href="/register"
          className="text-black font-semibold hover:text-[#40E0D0] transition"
        >
          Sign Up
        </a>
        <a
          href="/login"
          className="text-black font-semibold hover:text-[#40E0D0] transition"
        >
          Login
        </a>
      </nav>

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
            src="/cherry-blossom-outline.svg"
            alt="cherry blossom leaf"
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
