'use client'

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSpotifyAuth } from '@/context/SpotifyAuthContext';
import { auth } from '../../../../lib/firebase'; 
import { signInWithCustomToken } from 'firebase/auth';
import { db } from '../../../../lib/firebase'; 
import { doc, setDoc } from 'firebase/firestore';

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!;
const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI!;

const CallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAccessToken, setRefreshToken, setExpiresIn } = useSpotifyAuth();

  useEffect(() => {
    const fetchAccessToken = async (code: string) => {
      try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
          },
          body: new URLSearchParams({
            code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch access token');
        }

        const data = await response.json();
        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;
        const expiresIn = Date.now() + (data.expires_in * 1000);

        // store the token in the global context
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setExpiresIn(expiresIn);

        // fetch profile
        const userProfileResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!userProfileResponse.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userProfile = await userProfileResponse.json();

        // create the custom token and sign in
        const customTokenResponse = await fetch('/api/createCustomToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: userProfile.id }),
        });

        if (!customTokenResponse.ok) {
          throw new Error('Failed to create custom token');
        }

        const customTokenData = await customTokenResponse.json();

        await signInWithCustomToken(auth, customTokenData.token);

        // store it in firestore
        await setDoc(doc(db, 'users', userProfile.id), {
          name: userProfile.display_name,
          email: userProfile.email,
          profileUrl: userProfile.images[0]?.url || null,
        });

        // redirect to home page after sign-in
        router.push('/');
      } catch (error) {
        console.error('Error during authentication:', error);
      }
    };

    const code = searchParams.get('code');
    if (code) {
      fetchAccessToken(code);
    }
  }, [searchParams, router, setAccessToken, setRefreshToken, setExpiresIn]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Processing...</h1>
      </div>
    </div>
  );
};

export default CallbackPage;
