'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!;

interface SpotifyAuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number;
  userId: string | null; 
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setExpiresIn: (time: number) => void;
  setUserId: (id: string) => void;
  refreshAccessToken: () => void;
}

const SpotifyAuthContext = createContext<SpotifyAuthContextType | undefined>(undefined);

export const SpotifyAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null); 

  const refreshAccessToken = async () => {
    if (!refreshToken) return;
    // get token from spotify
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      // set new data
      const data = await response.json();
      const newAccessToken = data.access_token;
      const newExpiresIn = Date.now() + data.expires_in * 1000;

      setAccessToken(newAccessToken);
      setExpiresIn(newExpiresIn);
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('expiresIn', newExpiresIn.toString());
    } catch (error) {
      console.error('Error refreshing access token:', error);
    }
  };

  // sync context state with localstorage 
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedExpiresIn = localStorage.getItem('expiresIn');
    const storedUserId = localStorage.getItem('userId');

    if (storedAccessToken) setAccessToken(storedAccessToken);
    if (storedRefreshToken) setRefreshToken(storedRefreshToken);
    if (storedExpiresIn) setExpiresIn(Number(storedExpiresIn));
    if (storedUserId) setUserId(storedUserId);
  }, []);

  // sync tokens and userId to localstorage when they change
  useEffect(() => {
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    if (expiresIn) localStorage.setItem('expiresIn', expiresIn.toString());
    if (userId) localStorage.setItem('userId', userId);
  }, [accessToken, refreshToken, expiresIn, userId]);

  useEffect(() => {
    const checkTokenExpiry = () => {
      if (expiresIn < Date.now()) {
        refreshAccessToken();
      }
    };

    const intervalId = setInterval(checkTokenExpiry, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [expiresIn, refreshToken]);

  return (
    <SpotifyAuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        expiresIn,
        userId,
        setAccessToken,
        setRefreshToken,
        setExpiresIn,
        setUserId,
        refreshAccessToken,
      }}
    >
      {children}
    </SpotifyAuthContext.Provider>
  );
};

export const useSpotifyAuth = () => {
  const context = useContext(SpotifyAuthContext);
  if (!context) {
    throw new Error('useSpotifyAuth must be used within a SpotifyAuthProvider');
  }
  return context;
};
