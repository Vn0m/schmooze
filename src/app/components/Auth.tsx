'use client'

import { FaSpotify } from 'react-icons/fa'; 

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI!;
const scope = 'user-read-email user-read-private';  

const Auth = () => {
  // Sends user to Spotify login page
  const handleLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = authUrl;
  };

  return (
    <div className="flex min-h-screen flex-row">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 bg-transparent">
        <div className="max-w-md mx-auto w-full">
          <div className="flex items-center space-x-2 mb-8">
            <span className='text-3xl'>🎵</span>
            <h1 className="text-4xl font-semibold">Welcome!</h1>
          </div>
          <p className="text-lg mb-6">Log in with your Spotify account.</p>
          
          <button onClick={handleLogin} className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-all flex items-center justify-center space-x-3 mb-4">
            <FaSpotify size={24} />
            <span>Login with Spotify</span>
          </button>
          <div className="text-center mt-6 text-sm text-gray-500">
            Having trouble with your account? Contact support at <a href="#" className="text-green-500 hover:underline">schmooze.support.com</a>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex w-1/2 bg-gradient-to-t from-green-300 to-blue-400 items-center justify-center">
        <div className="text-white text-center px-8">
          <h1 className="text-5xl font-extrabold mb-4">Share your <span className='text-green-300 text-6xl'>music</span> with the world!</h1>
          <p className="text-xl">Join a community of users who discover and share their passion for music.</p>
        </div>
      </div>  
    </div>
  );
};

export default Auth;
