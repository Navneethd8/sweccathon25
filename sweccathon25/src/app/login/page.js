'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../firebase/authService'; // make sure the path is correct

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, router);
    } catch (error) {
      console.error(error.message);
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFB7C5] p-6">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-10 w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-bold text-[#4B2E83] mb-6 text-center">Welcome Back</h1>
        
        {/* Actual Form */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            className="px-4 py-3 rounded-full border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#4B2E83]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="px-4 py-3 rounded-full border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#4B2E83]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="bg-[#4B2E83] text-white rounded-full py-3 hover:bg-[#362366] transition font-semibold"
          >
            Log In
          </button>
        </form>

        {/* Forgot Password */}
        <div className="mt-6 text-center text-sm">
          <a href="/forgot-password" className="text-black hover:text-[#40E0D0]">
            Forgot your password?
          </a>
        </div>

        {/* Sign Up Link */}
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <a href="/register" className="font-semibold text-[#4B2E83] hover:text-[#40E0D0]">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
