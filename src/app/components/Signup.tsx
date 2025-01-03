'use client';

import Link from 'next/link'; 
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const Signup = () => {
  const router = useRouter();

  const { login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: {
            email,
            username,
            password,
            confirmPassword,
          },
        }),
      });

      if (response.ok) {
        login(email,password);
        router.push('/');
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to sign up");
      }
    } catch (err) {
        console.error("Error sending the post request: ", err);
        setError("Failed to sign up, try again.");
    }
  };
  return (
    <div className="flex min-h-screen flex-row">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 bg-white shadow-lg">
        <div className="max-w-md mx-auto w-full">
          <div className="flex items-center space-x-2 mb-8">
            <h1 className="text-4xl font-bold">👋</h1>
            <h1 className="text-4xl font-semibold">Welcome!</h1>
          </div>

          <h2 className="mb-6 text-slate-400">Create a new account with your email.</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                className='px-4 py-2 w-full border rounded-md'
                placeholder='name@gmail.com'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                className='px-4 py-2 w-full border rounded-md'
                placeholder='schmoozy12'
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                className='px-4 py-2 w-full border rounded-md'
                placeholder='Should be a secret...'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className='mb-4'>
              <label className="block text-sm font-medium text-gray-700">Confirm password</label>
              <input
                className='px-4 py-2 w-full border rounded-md'
                placeholder='Same as above 👀'
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>} 
            <button type="submit" className="w-full bg-[#9fade3] hover:bg-[#8694cb] text-white py-3 rounded-lg font-semibold transition-all">
              Sign up
            </button>
          </form>
          <p className='text-gray-500 text-sm mt-4'>Already have an account? <Link className='underline text-[#828282]' href="/login">Login</Link></p>
          <div className="text-center mt-6 text-sm text-gray-500">
            Having trouble with your account? <br />
            Contact support at <a href="#" className="text-[#a6b6f5] hover:underline">help.schmooze.support.com</a>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex w-1/2 bg-gradient-to-t from-[#bfc7e8] to-[#89c4ff] items-center justify-center">
        <div className="text-white text-center px-8">
          <h1 className="text-5xl font-extrabold mb-4">Share your <span className='text-[#849dff] text-6xl'>music</span> with the world!</h1>
          <p className="text-xl px-5">Join a community of people who love to discover and share their passion for music.</p>
        </div>
      </div>  
    </div>
  );
};

export default Signup;

