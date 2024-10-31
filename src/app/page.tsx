'use client'

import React, { useEffect, useState } from 'react';
import { db } from "../../lib/firebase";
import { collection, addDoc, getDocs, doc, getDoc, query, orderBy, Timestamp } from "firebase/firestore";
import Post from './components/Post';
import Navbar from "./components/Navbar";
import Signup from './components/Signup';
import Header from './components/Header';
import { useSpotifyAuth } from '@/context/SpotifyAuthContext';
import Link from 'next/link';
import { FaPaperPlane, FaRegPaperPlane } from 'react-icons/fa';

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState<string>(''); // State for content input
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { userId } = useSpotifyAuth();
  const [userProfile, setProfile] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        // console.log(data.posts); 
        
        setPosts(data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };    
    fetchPosts();
  }, []);
  
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

  // Handle post submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content) {
      setErrorMessage('Content is required.');
      return;
    }
    if (!userId) {
      setShowAuthModal(true);
      setErrorMessage('Login or create an account to post, like, and comment on Schmooze')
    }

    try {
      // Add post to Firestore
      const postsCollection = collection(db, 'posts');
      await addDoc(postsCollection, {
        content,
        userId: userId, // Include the userId in the post
        time: new Date(),  // Include the time when the post is created
        likes: [],
        dislikes: [],
        comments: [],
      });

      // Clear the input and update the post list
      setContent('');
      setErrorMessage(null);

      // Refetch posts to include the new post
      const postsQuery = query(postsCollection, orderBy('time', 'desc'));
      const snapshot = await getDocs(postsQuery);
      const postsData = snapshot.docs.map((doc: { id: any; data: () => any; }) => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);

    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  return (
    <main className="bg-black grid grid-cols-5 gap-8 p-4 h-full min-h-screen">
      <Navbar />
      <div className="col-span-3 bg-black overflow-y-auto h-[650px]">
        <Header userProfile={userProfile} />
            <div className="relative flex flex-col bg-[#191919] rounded-lg mb-3 mt-3 h-28">
              <input
                type="text"
                placeholder="What's on your mind?"
                className="rounded-lg bg-[#646464] m-3 h-10 px-5 focus:outline-none focus:outline-green-400"
                value={content}
                onChange={(e) => setContent(e.target.value)} 
              />
              <button onClick={handleSubmit} className="absolute bottom-5 right-5">
                <FaRegPaperPlane color='#1DB954'/>
              </button>
            </div>
          <div className='bg-black grid gap-3'>
            {posts.map(post => (
              <Post 
                key={post.id}
                postId={post.id} 
                userId={post.userId} 
                comments={post.comments} 
                content={post.content}
                dislikes={post.dislikes} 
                likes={post.likes} 
                time={post.time} 
              />
            ))}
          </div>
        </div>
      <div className="col-span-1 bg-[#191919] rounded-lg h-[650px]">friends</div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 min-h-4">
          <div className="p-6 rounded-lg shadow-lg">
            <Signup /> 
          </div>
        </div>
      )}
    </main>
  );
}


