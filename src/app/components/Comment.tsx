import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Timestamp } from "firebase-admin/firestore";

interface CommentProps {
  commentId: string;
  userId: string;
  time: Timestamp;
  content: string;
  likes: [];
  dislikes: [];
}

const Comment = ({ commentId, userId, time, content, likes, dislikes }: CommentProps) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const date = time?.seconds ? new Date(time.seconds * 1000) : null;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        setUserProfile(userDoc.exists() ? userDoc.data() : null);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  return (
    <div className="text-sm text-[#646464] bg-[#191919] rounded-lg p-3 gap-x-3 flex-col">
      <div className="flex space-x-3">
        <img
          src={userProfile?.images?.profileUrl || '/pfp.jpg'}
          alt="User profile"
          className="w-10 h-10 object-cover rounded-full"
        />
        <p>{userProfile?.name || 'Anonymous'}</p>
        <p>{date ? date.toDateString() : 'Date unavailable'}</p>
      </div>
      <p className='p-1 pt-3 text-white'>{content || 'No content available'}</p>
      <div className='flex flex-row space-x-5'>
          {/* <LikeButton postId={postId} likes={likes} setLikes={setLikes} userId={userId} />
          <CommentButton postId={postId} comments={comments} /> */}
      </div>
    </div>
  );
};

export default Comment;
