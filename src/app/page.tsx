'use client'
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Post from './components/Post';

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(db, 'posts');
        const snapshot = await getDocs(postsCollection);
        const postsData = snapshot.docs.map((doc: { id: any; data: () => any; }) => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);



  return (
    <main className="bg-black grid grid-cols-5 gap-8 p-4 h-full min-h-screen">
      <div className="col-span-1 bg-[#191919] rounded-lg h-[650px]">menu bar</div>
      <div className="col-span-3 bg-black overflow-y-auto h-[650px]">
      <div className="relative bg-[url('/header.jpg')] bg-cover w-full h-60 bg-center">
        <div className="absolute left-4 top-24 flex items-center space-x-4">
          <img src="/pfp.jpg" alt="Sample Image" className="w-32 h-32 rounded-full" />
          <div className="flex flex-col">
            <p className="text-[#C7C7C7]">Dashboard</p>
            {/* hardcoded for now but will change to fetch Spotify data */}
            <h1 className="text-white font-semibold text-[35px]">Davide Biscuso</h1>
            <p className="text-[#C7C7C7] text-[12px]">3 Public Playlists • 13 followers • 19 following</p>
          </div>
        </div>
      </div>
        <div className="relative flex flex-col bg-[#191919] rounded-lg mb-3 mt-3 h-28">
          <input type="text" placeholder="What's on your mind?" className="rounded-lg bg-[#646464] m-3 h-10 px-5 focus:outline-none focus:outline-green-400" ></input>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute size-6 stroke-[#1DB954] bottom-5 right-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
        <div>
          {/* <h2 className="text-white">Posts</h2> */}
          {posts.map(post => (
            <Post
            key={post.id}
            postId={post.id}
            />
          ))}
        </div>
      </div>
      <div className="col-span-1 bg-[#191919] rounded-lg h-[650px]">friends</div>
    </main>
  );
}
