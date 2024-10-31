'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useSpotifyAuth } from '@/context/SpotifyAuthContext';
import LikeButton from './LikeButton';


interface PostProps {
  postId: string;
}

const Post: React.FC<{ postId: string; className?: string }> = ({ postId, className }) => {
  const [post, setPost] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [likes, setLikes] = useState<string[]>([]);
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

  const date = new Date(post?.time.seconds*1000)

  if (!post) {
    return <div>Loading post...</div>;
  }

  return (
    <div className={`text-[#646464] bg-[#191919] rounded-lg p-3 mb-3 w-full h-full ${className}`}>
      <div className="flex space-x-3">
        <img
          src={userProfile?.images?.profileUrl || '/pfp.jpg'}
          alt="User profile"
          className="w-12 h-12 object-cover rounded-full inline"
        />
        <p className="">{userProfile?.name || 'Anonymous'}</p>
        <p>{date.toDateString().slice(3)}</p>
      </div>
      <p className='p-1 pt-3'>{post?.content || 'No content available'}</p>
      <div className='flex flex-row space-x-5'>
          <LikeButton postId={postId} likes={likes} setLikes={setLikes} userId={userId} />
      </div>
    </div>
  );
}

export default Post;
