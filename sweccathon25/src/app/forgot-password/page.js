'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { forgotPassword } from '../firebase/authService'; // adjust the path if needed

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email, router);
    } catch (error) {
      console.error(error.message);
      alert('Failed to send reset email: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFB7C5] p-6">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-10 w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-bold text-[#4B2E83] mb-6 text-center">Reset Password</h1>
        
        {/* Actual Form */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="px-4 py-3 rounded-full border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#4B2E83]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="bg-[#4B2E83] text-white rounded-full py-3 hover:bg-[#362366] transition font-semibold"
          >
            Send Reset Link
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center text-sm">
          <a href="/login" className="text-black hover:text-[#40E0D0]">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
