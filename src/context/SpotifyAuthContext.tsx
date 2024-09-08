'use client'

import React, { createContext, useState, useContext, useEffect } from 'react';

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!;

interface SpotifyAuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setExpiresIn: (time: number) => void;
  refreshAccessToken: () => void;
}

const SpotifyAuthContext = createContext<SpotifyAuthContextType | undefined>(undefined);

export const SpotifyAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number>(0);

  useEffect(() => {
    // load tokens and expiration time from localStorage
    const storedAccessToken = localStorage.getItem('spotify_access_token');
    const storedRefreshToken = localStorage.getItem('spotify_refresh_token');
    const storedExpiresIn = localStorage.getItem('spotify_expires_in');

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken);
    }
    if (storedExpiresIn) {
      setExpiresIn(parseInt(storedExpiresIn, 10));
    }
  }, []);

  const refreshAccessToken = async () => {
    if (!refreshToken) return;

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      const newAccessToken = data.access_token;
      const newExpiresIn = Date.now() + (data.expires_in * 1000);

      setAccessToken(newAccessToken);
      setExpiresIn(newExpiresIn);

      localStorage.setItem('spotify_access_token', newAccessToken);
      localStorage.setItem('spotify_expires_in', newExpiresIn.toString());
    } catch (error) {
      console.error('Error refreshing access token:', error);
    }
  };

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
    <SpotifyAuthContext.Provider value={{ accessToken, refreshToken, expiresIn, setAccessToken, setRefreshToken, setExpiresIn, refreshAccessToken }}>
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
