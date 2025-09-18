'use client'
import { useState } from "react";
import { signUp } from "../firebase/authService";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const router = useRouter();

  async function handleSignUp(e) {
    e.preventDefault();
    try {
      await signUp(email, password, file, router);
      // Redirect or show success
    } catch (error) {
      alert("Failed to sign up: " + error.message);
    }
  }

  return (
    <div>
      <title>Register</title>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[var(--page-background)] px-4">
        <div className="bg-[#4A8D5E] shadow-lg rounded-2xl p-8 w-full max-w-md flex flex-col items-center backdrop-blur-md">
          <h1 className="text-3xl font-bold mb-6 text-[var(--background)]">Create Account</h1>
          <form onSubmit={handleSignUp} className="w-full flex flex-col gap-4">
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#7DC091] px-4 py-3 rounded-full border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#25462F]"
            />
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#7DC091] px-4 py-3 rounded-full border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#25462F]"
            />
            
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="block text-sm text-black file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-[#BEDFC8] file:text-black
              hover:file:bg-[#7DC091]"
            />

            <button
              type="submit"
              className="mt-4 bg-[#BEDFC8] text-black rounded-full py-3 hover:bg-[#7DC091] transition font-semibold"
            >
              Sign Up
            </button>
          </form>

          <p className="text-sm text-white mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-[#DFEFE3] hover:text-[#132317]">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}
