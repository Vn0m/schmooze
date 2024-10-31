'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const Auth = () => {
  const router = useRouter();
  const { login } = useAuth(); 
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login. Please check your credentials and try again.');
    }
  };

  return (
    <div className="flex min-h-screen flex-row">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 bg-white shadow-lg">
        <div className="max-w-md mx-auto w-full">
          <div className="flex items-center space-x-2 mb-8">
            <h1 className="text-4xl font-bold">👋</h1>
            <h1 className="text-4xl font-semibold">Welcome back!</h1>
          </div>

          <h2 className="mb-6 text-slate-400">Log in with your email and password.</h2>

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
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                className='px-4 py-2 w-full border rounded-md'
                placeholder='Your secret key...'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-right mt-2">
                <a href="#" className="text-gray-400 hover:underline text-sm">Forgot your password?</a>
              </div>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button type="submit" className="w-full bg-[#9fade3] hover:bg-[#8694cb] text-white py-3 rounded-lg font-semibold transition-all">
                Log in
            </button>
          </form>          
          <p className='text-gray-500 text-sm mt-4'>Dont have an account? <Link className='underline text-[#828282]' href="/signup">Sign up</Link></p>
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>Having trouble with your account? <br />
            Contact support at <a href="#" className="text-[#a6b6f5] hover:underline">help.schmooze.support.com</a>
            </p>
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

export default Auth;