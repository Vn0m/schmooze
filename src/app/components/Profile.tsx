'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSpotifyAuth } from '@/context/SpotifyAuthContext';
import { db } from '../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Navbar from './Navbar';

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
          console.log('User not found in database');
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
    <div className="bg-black grid grid-cols-5 gap-8 p-4 h-full min-h-screen">
      <Navbar />
      <div className="col-span-3 bg-black overflow-y-auto h-[650px]">
        <div className="relative bg-[url('/header.jpg')] bg-cover w-full h-60 bg-center">
          
          <div className="absolute left-8 bottom-6 flex items-center space-x-6">
            {profile?.images ? (
              <Image
                className="w-full h-40 rounded-full shadow-lg"
                src={profile.images.profileUrl}
                width={profile.images.imageWidth}
                height={profile.images.imageHeight}
                alt="Profile picture"
                priority
              />
            ) : (
              <div className="w-40 h-40 bg-gray-700 rounded-full" />
            )}

            <div className="text-white">
              <p className="text-sm text-[#C7C7C7]">Profile</p>
              {profile ? (
                <div>
                  <p className="text-4xl font-semibold">{profile.name}</p>
                  <p className="text-lg text-[#C7C7C7]">{profile.country}</p>
                  <p className="text-sm mt-2 text-[#C7C7C7]">{profile.total} followers</p>
                </div>
              ) : (
                <p>Loading profile...</p>
              )}
            </div>
          </div>
        </div>
        <div className="bg-[#191919] rounded-lg h-[400px] mt-3">
          {/* Additional content or posts */}
        </div>
      </div>

      <div className="col-span-1 bg-[#191919] rounded-lg h-[650px]">Friends</div>
    </div>
  );
};

export default UserProfile;
