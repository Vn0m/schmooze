'use client'
import React, { useEffect, useState } from 'react';
import { db } from "../../lib/firebase";
import { collection, addDoc, getDocs, doc, getDoc, DocumentData, query, orderBy } from "firebase/firestore";
import Post from './components/Post';
import Navbar from "./components/Navbar";
import Auth from './components/Auth';
import { useSpotifyAuth } from '@/context/SpotifyAuthContext';

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
        const postsCollection = collection(db, 'posts');
        const postsQuery = query(postsCollection, orderBy('time', 'desc'));
        const snapshot = await getDocs(postsQuery);
        const postsData = snapshot.docs.map((doc: { id: any; data: () => any; }) => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
        console.log('fetched posts');
      } catch (error) {
        console.error("Error fetching posts:", error);
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
        likes: 0,
        dislikes: 0,
        comments: [],
      });

      // Clear the input and update the post list
      setContent('');
      setErrorMessage(null);

      // Refetch posts to include the new post
      const snapshot = await getDocs(postsCollection);
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
        <div className="relative bg-[url('/header.jpg')] bg-cover w-full h-60 bg-center">
          <div className="absolute left-4 top-24 flex items-center space-x-4">
            <img src={userProfile?.profileUrl || '/pfp.jpg'} alt="User Profile" className="w-32 h-32 rounded-full" />
            <div className="flex flex-col">
              <p className="text-[#C7C7C7]">Dashboard</p>
              <h1 className="text-white font-semibold text-[35px]">{userProfile?.name || 'Anonymous'}</h1>
              <p className="text-[#C7C7C7] text-[12px]">3 Public Playlists • 13 followers • 19 following</p>
            </div>
          </div>
        </div>
            <div className="relative flex flex-col bg-[#191919] rounded-lg mb-3 mt-3 h-28">
              <input
                type="text"
                placeholder="What's on your mind?"
                className="rounded-lg bg-[#646464] m-3 h-10 px-5 focus:outline-none focus:outline-green-400"
                value={content}
                onChange={(e) => setContent(e.target.value)} 
              />
              <button onClick={handleSubmit} className="absolute bottom-5 right-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 stroke-[#1DB954]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </button>
            </div>
        <div>
          {posts.map(post => (
            <Post
              key={post.id}
              postId={post.id}
            />
          ))}
        </div>
      </div>
      <div className="col-span-1 bg-[#191919] rounded-lg h-[650px]">friends</div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 min-h-4">
          <div className="bg-transparent p-6 rounded-lg shadow-lg">
            <Auth /> 
          </div>
        </div>
      )}
    </main>
  );
}


