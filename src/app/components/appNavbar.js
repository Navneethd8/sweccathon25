import { useState,useEffect } from "react";
import { useRouter,usePathname } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";




export default function AppNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const router = useRouter();
  const pathname = usePathname(); // <- this is the current path

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "Users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setProfilePic(data.profilePicture || null);
          }
        } catch (err) {
          console.error("Error fetching profile picture:", err);
        }
      } else {
        setProfilePic(null); // fallback when logged out
      }
    });
  
    return () => unsubscribe();
  }, []);


  const getLinkColor = (href) => (pathname === href ? "text-[#15401A]" : "text-white");

  return (
    <div>
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-screen z-50 sm:hidden">
            <div className="flex justify-between items-center w-full max-w-screen h-[83px] px-[29px] py-[25px] bg-[#5DB075]">
            <a href='/dashboard' className="text-white font-bold text-lg">
                <img src="Group 1.png" alt="ET Logo" className="h-20 w-auto" />
            </a>
            
            <div className="flex items-center gap-4">
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

                {/* Hamburger Menu */}
                <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white text-2xl focus:outline-none"
                >
                {isOpen ? <HiX /> : <HiMenu />}
                </button>
            </div>
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
                <a href="/" className={`font-semibold transition ${getLinkColor("/register")}`}>Leaderboard</a>
            </div>

            <div className="ml-auto">
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
        </nav>
    </div>
  );
}
