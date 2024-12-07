'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useSpotifyAuth } from '@/context/SpotifyAuthContext';
import LikeButton from './LikeButton';
import CommentButton from './CommentButton';
import Link from 'next/link';
import { Timestamp } from 'firebase-admin/firestore';

interface PostProps {
  postId: string;
  userId: string;
  comments: string[]; 
  content: string;
  dislikes: string[]; 
  likes: string[]; 
  time: Timestamp;
  className?: string;
}

const Post: React.FC<PostProps> = ({ postId, userId, comments, content, dislikes, likes, className, time }) => {  const [post, setPost] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [newlikes, setLikes] = useState<string[]>([]);
  // const { userProfile } = useSpotifyAuth();

  const date = time?.seconds ? new Date(time.seconds * 1000) : null;

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
          return;
        }

        setUserProfile(userDoc.data());
      } catch (error) {
        console.error('Error fetching profile from Firestore:', error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  return (
    <div className={`text-[#646464] bg-black w-full h-full ${className}`}>
      <div className='bg-[#191919] rounded-lg p-3'>
        <div className="flex space-x-3">
          <img
            src={userProfile?.images?.profileUrl || '/pfp.jpg'}
            alt="User profile"
            className="w-12 h-12 object-cover rounded-full inline"
          />
          <p className="">{userProfile?.username || 'Anonymous'}</p>
          <p>{date ? date.toDateString() : 'Date unavailable'}</p>
        </div>
        <Link
                key={postId}
                href={`/post/${postId}`}
                className="text-white flex items-center hover:bg-transparent rounded-lg "
              >
        <p className='p-1 pt-3'>{content || 'No content available'}</p>
        </Link>
        <div className='flex flex-row space-x-5'>
            <LikeButton postId={postId} likes={likes} setLikes={setLikes} userId={userId} />
            <CommentButton postId={postId} comments={comments} />
        </div>
      </div>
    </div>
  );
}

export default Post;
