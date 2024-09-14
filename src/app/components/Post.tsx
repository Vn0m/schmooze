'use client'

import React, { useState } from 'react';

interface PostProps {
  title: string;
  content: string;
}

function Post({ title, content }: PostProps) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<string[]>([]);

  const handleLike = () => setLikes(likes + 1);
  const handleDislike = () => setDislikes(dislikes + 1);
  const handleAddComment = () => {
    if (comment.trim()) {
      setComments([...comments, comment]);
      setComment('');
    }
  };

  return (
    <div className='text-[#646464]'>
      <h3>{title}</h3>
      <p>{content}</p>
      <div style={postStyles.actions}>
        <button onClick={handleLike}>Like ({likes})</button>
        <button onClick={handleDislike}>Dislike ({dislikes})</button>
      </div>
      <div style={postStyles.commentsSection}>
        <h4>Comments</h4>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={handleAddComment}>Add Comment</button>
        <ul>
          {comments.map((cmt, index) => (
            <li key={index}>{cmt}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const postStyles = {
  container: {
    backgroundColor: '#191919',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  actions: {
    marginBottom: '8px',
  },
  commentsSection: {
    marginTop: '8px',
  },
  title: {
    color: '#646464', 
  },
  content: {
    color: '#646464', 
  },
};

export default Post;
