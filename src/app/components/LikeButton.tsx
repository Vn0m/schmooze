import { doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { db } from '../../../lib/firebase';

interface LikeButtonProps {
    postId: string;
    likes: string[];
    setLikes: React.Dispatch<React.SetStateAction<string[]>>;
    userId: string | null;
  }
  
const LikeButton = ({ postId, likes, userId, setLikes }: LikeButtonProps) => {
    if(userId == null) {
        return("log in to like");
    }

    const [isLiked, setIsLiked] = useState(false);

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
            console.log('current likes:', likes);
            const updatedLikes = likes.filter((id) => id !== userId);
            updateDoc(postRef, { likes: updatedLikes });
            setLikes(updatedLikes);
            console.log('new likes:', updatedLikes);
        } else {
            console.log('current likes:', likes);
            const updatedLikes = [...likes, userId];
            updateDoc(postRef, { likes: updatedLikes });
            setLikes(updatedLikes);
            console.log('new likes:', updatedLikes);
        }    
    };

  return (
    <div className='flex items-center space-x-2'>
      <button onClick={handleLike}>
        {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
      </button>
      <span>{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</span>
    </div>
  );
};

export default LikeButton;




