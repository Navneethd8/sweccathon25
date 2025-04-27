'use client'
import { useState } from "react";
import { signUp } from "../firebase/authService";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen flex items-center justify-center bg-[#ffb7c5] px-4">
      <div className="bg-white/80 shadow-lg rounded-2xl p-8 w-full max-w-md flex flex-col items-center backdrop-blur-md">
        <h1 className="text-3xl font-bold mb-6 text-[#4b2e83]">Create Account</h1>
        <form onSubmit={handleSignUp} className="w-full flex flex-col gap-4">
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-full border border-[#4b2e83] focus:outline-none focus:ring-2 focus:ring-[#4b2e83]/50"
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-full border border-[#4b2e83] focus:outline-none focus:ring-2 focus:ring-[#4b2e83]/50"
          />
          
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="block text-sm text-black file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-[#4b2e83] file:text-white
            hover:file:bg-[#372063]"
          />

          <button
            type="submit"
            className="mt-4 bg-black text-white rounded-full py-3 font-semibold hover:bg-[#4b2e83] transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-black/60 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-[#4b2e83] hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
