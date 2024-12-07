import { doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { db } from '../../../lib/firebase';
import { useRouter } from 'next/navigation';

interface LikeButtonProps {
    postId: string;
    likes: string[];
    setLikes: React.Dispatch<React.SetStateAction<string[]>>;
    userId: string;
  }
  
const LikeButton = ({ postId, likes, userId, setLikes }: LikeButtonProps) => {
    const [isLiked, setIsLiked] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (likes.includes(userId)) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      }, [likes, userId]); 

    const handleLike = async () => {
        const postRef = doc(db, 'posts', postId);

        if (isLiked) {
          const updatedLikes = likes.filter((id) => id !== userId);
          updateDoc(postRef, { likes: updatedLikes });
          setLikes(updatedLikes);
        } else {
          const updatedLikes = [...likes, userId];
          updateDoc(postRef, { likes: updatedLikes });
          setLikes(updatedLikes);
        } 
    };

    const handleLikeAnonUser = async () => {
      console.log("anon user trying to like");
      router.push("/signup");
    }

  return (
    <div className='flex items-center space-x-2'>
      <button onClick={userId ? handleLike : handleLikeAnonUser}>
        {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
      </button>
      <span>{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</span>
    </div>
  );
};

export default LikeButton;




