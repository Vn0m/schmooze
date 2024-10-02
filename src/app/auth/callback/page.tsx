'use client';

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
  const { setAccessToken, setRefreshToken, setExpiresIn, setUserId } = useSpotifyAuth();

  useEffect(() => {
    const fetchAccessToken = async (code: string) => {
      // get token from spotify
      try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
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
        const expiresIn = Date.now() + data.expires_in * 1000;

        // set data in context
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setExpiresIn(expiresIn);

        // save in localstorage too
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('expiresIn', expiresIn.toString());

        // fetch spotify user profile
        const userProfileResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!userProfileResponse.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userProfile = await userProfileResponse.json();
        
        // set userId in context and localstorage
        setUserId(userProfile.id);
        localStorage.setItem('userId', userProfile.id);

        // custom token sign in
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


        // todo: finish profile frontend, google ouath, username email password, change profile picture
        // store user in firebase
        await setDoc(doc(db, 'users', userProfile.id), {
          name: userProfile.display_name,
          email: userProfile.email,
          images : {
            profileUrl: userProfile.images[0]?.url || null,
            imageHeight: userProfile.images[0]?.height || null, // Ensure this value exists
            imageWidth: userProfile.images[0]?.width || null, 
          },
          total: userProfile.followers.total,
          country: userProfile.country,
          uri: userProfile.uri,
        });

        // redirect to homepage after sign in
        router.push('/');
      } catch (error) {
        console.error('Error during authentication:', error);
      }
    };

    const code = searchParams.get('code');
    if (code) {
      fetchAccessToken(code);
    }
  }, [searchParams, router, setAccessToken, setRefreshToken, setExpiresIn, setUserId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
    </div>
  );
};

export default CallbackPage;
