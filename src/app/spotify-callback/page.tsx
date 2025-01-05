'use client';
// todo: finish profile frontend, google ouath, username email password, change profile picture, check why anonymous pfp appears when making post
// todo: tabs for profile section

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSpotifyAuth } from '@/context/SpotifyAuthContext';
import { auth } from '../../../lib/firebase';
import { db } from '../../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!;
const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI!;

const CallbackPage = () => {
  const { user } = useAuth(); 
  console.log('Current user:', user);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAccessToken, setRefreshToken, setExpiresIn, setUserId } = useSpotifyAuth();

  useEffect(() => {
    const fetchAccessToken = async (code: string) => {
      // get token from spotify
      try {
        console.log('Fetching access token...');
        console.log('Authorization:', `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`);
console.log('Request body:', {
  code,
  redirect_uri: redirectUri,
  grant_type: 'authorization_code',
});

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

        console.log('Access token fetched successfully');
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
        console.log('Fetching Spotify user profile...');
        const userProfileResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!userProfileResponse.ok) {
          throw new Error('Failed to fetch user profile');
        }

        console.log('User profile fetched successfully');
        const userProfile = await userProfileResponse.json();
        
        // set userId in context and localstorage
        setUserId(userProfile.id);
        localStorage.setItem('userId', userProfile.id);

        // Update the signed-in user's profile with Spotify data
        if (user) {
          console.log("User ID:", user.uid);
          console.log('Updating Firestore with user profile data...');
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            spotify: {
              name: userProfile.display_name,
              email: userProfile.email,
              images: {
                profileUrl: userProfile.images[0]?.url || null,
                imageHeight: userProfile.images[0]?.height || null,
                imageWidth: userProfile.images[0]?.width || null,
              },
              followers: userProfile.followers.total,
              country: userProfile.country,
              uri: userProfile.uri,
            },
          });
          console.log('Firestore updated successfully');
        } else {
          console.error('User is not authenticated or user.uid is missing');
        }

        // redirect to homepage after sign in
        console.log('Redirecting to homepage...');
        router.push('/');
      } catch (error) {
        console.error('Error during authentication:', error);
      }
    };

    const code = searchParams.get('code');
    if (code) {
      console.log('Authorization code received:', code);
      fetchAccessToken(code);
    } else {
      console.log('No authorization code found in search params');
    }
  }, [searchParams, router, setAccessToken, setRefreshToken, setExpiresIn, setUserId, user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
    </div>
  );
};

export default CallbackPage;
