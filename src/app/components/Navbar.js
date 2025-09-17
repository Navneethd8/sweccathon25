import { useState } from "react";
import { useRouter,usePathname } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // <- this is the current path

  const getLinkColor = (href) => (pathname === href ? "text-[#15401A]" : "text-white");

  return (
    <div>
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-screen z-50 sm:hidden">
        <div className="flex justify-between items-center w-full max-w-screen h-[83px] px-[29px] py-[26px] bg-[#5DB075]">
          <a href="/" className="text-white font-bold text-lg">
            <img src="Group 1.png" alt="ET Logo" className="h-20 w-auto" />
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white text-2xl focus:outline-none"
          >
            {isOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {isOpen && (
            <div className="w-full max-w-screen bg-[#5DB075] flex flex-col justify-top items-start gap-6 p-6">
                <a
                href="/register"
                className={`font-semibold text-lg transition ${getLinkColor("/register")}`}
                >
                Sign Up
                </a>
                <a
                href="/login"
                className={`font-semibold text-lg transition ${getLinkColor("/login")}`}
                >
                Login
                </a>
            </div>
        )}
      </div>

        <nav className="hidden sm:flex fixed top-0 left-1/2 transform -translate-x-1/2 items-center w-full max-w-screen h-[100px] px-[34px] py-[23px] bg-[#5DB075] z-50">
            <a href="/" className="text-white font-bold text-xl">
                <img src="Group 1.png" alt="ET Logo" className="h-20 w-auto" />
            </a>

            <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-6">
                <a href="/register" className={`font-semibold transition ${getLinkColor("/register")}`}>Sign Up</a>
                <a href="/login" className={`font-semibold transition ${getLinkColor("/login")}`}>Login</a>
            </div>
        </nav>
    </div>
  );
}
