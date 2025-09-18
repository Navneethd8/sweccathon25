'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../firebase/authService'; // make sure the path is correct
import Navbar from '../components/Navbar';

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
    <div>
      <title>Login</title>
          <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-[var(--page-background)] p-6">
      <div className="bg-[#4A8D5E] backdrop-blur-md rounded-3xl p-8 md:p-10 w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-bold text-[var(--background)] mb-6 text-center">Welcome Back</h1>
        
        {/* Actual Form */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <input 
            id="email"
            type="email" 
            placeholder="Email" 
            className=" bg-[#7DC091] text-black px-4 py-3 rounded-full border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#25462F]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            id="password"
            type="password" 
            placeholder="Password" 
            className=" bg-[#7DC091] px-4 py-3 rounded-full border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#25462F]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="bg-[#BEDFC8] text-black rounded-full py-3 hover:bg-[#7DC091] transition font-semibold"
          >
            Log In
          </button>
        </form>

        {/* Forgot Password */}
        <div className="mt-6 text-center text-sm">
          <a href="/forgot-password" className="text-white hover:text-[#132317]">
            Forgot your password?
          </a>
        </div>

        {/* Sign Up Link */}
        <div className="mt-4 text-center text-sm text-white">
          Don't have an account?{" "}
          <a href="/register" className="font-semibold text-[#DFEFE3] hover:text-[#132317]">
            Sign Up
          </a>
        </div>
      </div>
    </div>


    </div>
  );
}
