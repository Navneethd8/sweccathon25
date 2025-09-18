'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { forgotPassword } from '../firebase/authService'; // adjust the path if needed
import Navbar from '../components/Navbar';

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
    <div>
      <title>Reset Password</title>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[var(--page-background)] p-6">
        <div className="bg-[#4A8D5E] backdrop-blur-md rounded-3xl p-8 md:p-10 w-full max-w-md shadow-lg">
          <h1 className="text-3xl font-bold text-[var(--background)] mb-6 text-center">Reset Password</h1>
          
          {/* Actual Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-[#7DC091] px-4 py-3 rounded-full border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#25462F]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit" 
              className="bg-[#BEDFC8] text-black rounded-full py-3 hover:bg-[#7DC091] transition font-semibold"
            >
              Send Reset Link
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center text-sm">
            <a href="/login" className="text-white hover:text-[#132317]">
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
