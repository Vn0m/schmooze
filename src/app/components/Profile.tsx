'use client';

// todo: add timeouts for loging out and signing up and validate routes for verified users
// todo: change loading profile message for profile section

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { db, storage } from '../../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Navbar from './Navbar';
import { FiCamera } from 'react-icons/fi';
import { FaFan } from 'react-icons/fa';
import { useSpotifyAuth } from '@/context/SpotifyAuthContext';
import { FaSpotify } from 'react-icons/fa';

const UserProfile = () => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI!;
  const scope = 'user-read-email user-read-private';  
  const { accessToken } = useSpotifyAuth(); 
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;

      try {
        const response = await fetch(`/api/profile/${user.uid}`);
        if (!response.ok) {
          setError('Failed to fetch profile data');
          console.error('Failed to fetch profile:', response.statusText);
          return;
        }

        const profileData = await response.json();
        setProfile(profileData);
        setError(null);
      } catch (error) {
        setError('An error occurred while fetching the profile');
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (imageFile: File) => {
    if (!imageFile || !user) return;

    setUploading(true);
    const storageRef = ref(storage, `profilePictures/${user.uid}`);

    try {
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on('state_changed',
        (snapshot) => {},
        (error) => {
          setError('Error uploading image');
          console.error('Upload failed:', error);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at:", downloadURL);

          await updateDoc(doc(db, 'users', user.uid), {
            'images.profileUrl': downloadURL,
            'images.imageWidth': 300,
            'images.imageHeight': 300,
          });

          setProfile((prevProfile: any) => ({
            ...prevProfile,
            images: {
              ...prevProfile.images,
              profileUrl: downloadURL,
              imageWidth: 300,
              imageHeight: 300,
            },
          }));
          setUploading(false);
        }
      );
    } catch (error) {
      setError('Error uploading file');
      console.error('Error uploading file:', error);
      setUploading(false);
    }
  };

  return (
    <div className="bg-black grid grid-cols-6 gap-8 p-4 h-full min-h-screen">
      {/* Sidebar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="col-span-5 bg-black overflow-y-auto h-[650px] px-8">
        {/* Cover Image Section */}
        <div className="relative bg-[url('/header.jpg')] bg-cover w-full h-80 bg-center rounded-lg">
          <div className="absolute left-8 bottom-6 flex items-center space-x-6">
            <div className="relative group w-40 h-40">
              {profile?.images?.profileUrl ? (
                <Image
                  className="w-40 h-40 object-cover rounded-full shadow-lg transition-all transform hover:scale-105"
                  src={profile.images.profileUrl}
                  width={profile.images.imageWidth}
                  height={profile.images.imageHeight}
                  alt="Profile picture"
                  priority
                />
              ) : (
                <div className="w-40 h-40 bg-gray-700 rounded-full" />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <label htmlFor="fileInput" className="cursor-pointer">
                  <FiCamera size={30} className="text-white" />
                </label>
              </div>
              {uploading && <div className='absolute inset-0 flex justify-center items-center'><FaFan className='animate-bounce text-4xl' /></div>}
              <input
                id="fileInput"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div className="text-white">
              <p className="text-sm text-[#C7C7C7]">Profile</p>
              {profile ? (
                <div>
                  <div className='flex space-x-5 items-center'>
                    <p className="text-4xl font-semibold">{profile.username}</p>
                    <a href={authUrl} target="_blank" rel="noopener noreferrer">
                      <FaSpotify className="text-green-500 cursor-pointer hover:scale-110 transition-transform" size={24} />
                    </a>
                  </div>
                  <p className="text-lg text-[#C7C7C7]">{profile.country}</p>
                  <p className="text-sm mt-2 text-[#C7C7C7]">{profile.total} followers</p>
                </div>
              ) : error ? (
                <p className="text-red-500 text-sm">{error}</p>
              ) : (
                <p>Loading profile...</p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Stats and Actions */}
        <div className="bg-[#191919] p-4 mt-6 rounded-lg">
          <div className="flex justify-between items-center text-white">
            <div className="space-y-2">
              <p className="text-xl font-bold">Activity Stats</p>
              <p className="text-sm text-[#C7C7C7]">Recent Posts</p>
              <p className="text-sm text-[#C7C7C7]">Following: {profile?.following}</p>
              <p className="text-sm text-[#C7C7C7]">Posts: {profile?.posts}</p>
            </div>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all">
              Edit Profile
            </button>
          </div>
        </div>

        {/* User's Recent Activity (Posts, etc.) */}
        <div className="mt-6">
          <p className="text-white text-xl font-bold mb-4">Recent Activity</p>
          <div className="space-y-4">
            {/* Example post */}
            <div className="bg-[#191919] p-4 rounded-lg flex flex-col">
              <p className="text-white text-lg">Recent Album Release: "New Beginnings"</p>
              <p className="text-[#C7C7C7] text-sm mt-2">Some details about this release...</p>
            </div>
            {/* Add more posts here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
