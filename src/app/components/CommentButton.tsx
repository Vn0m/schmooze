import React, { useEffect, useState } from 'react';
import { FaComment, FaRegComment } from 'react-icons/fa';

interface CommentButtonProps {
    postId: string;
    comments: string[];
    // setComments: React.Dispatch<React.SetStateAction<{ commentId: string; userId: string; time: string; text: string; likes: []; dislikes: [] }[]>>;
    // userId: string | null;
  }

const CommentButton = ({ postId, comments}: CommentButtonProps) => {
    const handleComment = async () => {
  
    };

    return (
        <div>
            <div className='flex items-center space-x-2'>
                <button onClick={handleComment} className='flex-1'>
                    <FaRegComment />
                </button>
                <span>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
            </div>
        </div>
    );
};

export default CommentButton;
