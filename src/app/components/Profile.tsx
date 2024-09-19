'use client';

import React, { useEffect, useState } from 'react';
import { useSpotifyAuth } from '@/context/SpotifyAuthContext';
import { db } from '../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const UserProfile = () => {
  const { userId } = useSpotifyAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!userId) {
      console.log('No User ID available');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          console.log('Not in db');
          return;
        }

        setProfile(userDoc.data());
      } catch (error) {
        console.error('Error fetching profile from Firestore:', error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  return (
    <div>
      <h1>User Profile</h1>
      {profile ? (
        <div>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          {profile.profileUrl && (
            <img src={profile.profileUrl} alt="Profile" width={100} height={100} />
          )}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default UserProfile;
