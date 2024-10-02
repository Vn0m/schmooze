'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useSpotifyAuth } from '@/context/SpotifyAuthContext';


interface PostProps {
  postId: string;
}

const Post = ({ postId }: PostProps) => {
  const [post, setPost] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comments, setComments] = useState<string[]>([]);
  const { userId } = useSpotifyAuth();

  useEffect(() => {
    if (!postId) {
      console.log('No Post ID available');
      return;
    }

    // Fetch post data
    const fetchPost = async () => {
      try {
        const postRef = doc(db, 'posts', postId);
        const postDoc = await getDoc(postRef);

        if (!postDoc.exists()) {
          console.log('Post not found in db');
          return;
        }

        const postData = postDoc.data();
        setPost(postData);
        setLikes(postData.likes || 0);
        setComments(postData.comments || []);

        // Fetch user profile using the userId from the post
        const userRef = doc(db, 'users', postData.userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        } else {
          console.log('User profile not found');
        }
      } catch (error) {
        console.error('Error fetching post or user from Firestore:', error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLike = () => setLikes(likes + 1);
  const handleDislike = () => setDislikes(dislikes + 1);

  const date = new Date(post?.time.seconds*1000)

  if (!post) {
    return <div>Loading post...</div>;
  }

  return (
    <div className='text-[#646464] bg-[#191919] rounded-lg p-3 mb-3'>
      <div className="flex space-x-3">
        <img
          src={userProfile?.profileUrl || '/pfp.jpg'}
          alt="User profile"
          className="w-12 h-12 rounded-full inline"
        />
        <p className="">{userProfile?.name || 'Anonymous'}</p>
        <p>{date.toDateString().slice(3)}</p>
      </div>
      <p className='p-1 pt-3'>{post?.content || 'No content available'}</p>
      <div className='flex flex-row space-x-5'>
        <button onClick={handleLike} className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
          <p className='ml-2'>{post?.likes.length} Likes</p>
        </button>
        <button onClick={handleDislike} className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
          <p className='ml-2'>{post?.dislikes.length} Dislikes</p>
        </button>
        <p className='ml-2'>{comments.length} Comments</p>
      </div>
    </div>
  );
}

export default Post;
