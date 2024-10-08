'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSpotifyAuth } from '@/context/SpotifyAuthContext';
import { db, storage } from '../../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Navbar from './Navbar';
import { FiCamera } from 'react-icons/fi';
import { FaFan } from 'react-icons/fa';

const UserProfile = () => {
  const { userId } = useSpotifyAuth();
  const [profile, setProfile] = useState<any>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (imageFile: File) => {
    if (!imageFile || !userId) return;

    setUploading(true);
    const storageRef = ref(storage, `profilePictures/${userId}`);

    try {
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      
      uploadTask.on('state_changed', 
        (snapshot) => {
        }, 
        (error) => {
          console.error('Upload failed:', error);
          setUploading(false);
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at:", downloadURL);

          await updateDoc(doc(db, 'users', userId), {
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
      console.error('Error uploading file:', error);
      setUploading(false);
    }
  };

  return (
    <div className="bg-black grid grid-cols-5 gap-8 p-4 h-full min-h-screen">
      <Navbar />
      <div className="col-span-3 bg-black overflow-y-auto h-[650px]">
        <div className="relative bg-[url('/header.jpg')] bg-cover w-full h-60 bg-center">
          <div className="absolute left-8 bottom-6 flex items-center space-x-6">
            <div className="relative group w-40 h-40">
              {profile?.images?.profileUrl ? (
                <Image
                  className="w-40 h-40 object-cover rounded-full shadow-lg"
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
        </div>
      </div>

      <div className="col-span-1 bg-[#191919] rounded-lg h-[650px]">Friends</div>
    </div>
  );
};

export default UserProfile;
