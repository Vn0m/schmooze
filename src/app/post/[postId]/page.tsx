'use client'

import Navbar from "@/app/components/Navbar";
import Post from "../../components/Post";
import CommentForm from "@/app/components/CommentForm";
import Comment from "@/app/components/Comment";
import { SetStateAction, useEffect, useState } from "react";
import { Timestamp } from "firebase-admin/firestore";

interface CommentData {
  commentId: string;
  userId: string;
  time: Timestamp;
  content: string;
  likes: [];
  dislikes: [];
}

const PostPage = ({ params }: { params: { postId: string } }) => {
    const { postId } = params;
    const [post, setPost] = useState<any>();
    const [comments, setComments] = useState<CommentData[]>([]);


    useEffect(() => {
        const fetchPosts = async () => {
          try {
            const response = await fetch(`/api/posts/${postId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            const data = await response.json();
            // console.log("POST", data);

            if (data.post) {
              setPost(data.post); 
            }
          } catch (error) {
            console.error('Error fetching post:', error);
          }
        };    

        const fetchComments = async () => {
          try {
            const response = await fetch(`/api/posts/${postId}/comment`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            setComments(data.comments);
          } catch (error) {
            console.error("Error fetching comments:", error);
          }
        };
    
        fetchPosts();
        fetchComments();

      }, [postId]);

    return (
        <div className="bg-black grid grid-cols-5 gap-8 p-4 h-full min-h-screen text-lg">
            <Navbar />
            <div className="col-span-3 bg-black overflow-y-auto h-full rounded-lg">
                <div>
                    {post ? ( 
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
                    ) : (
                        <p>Loading...</p> 
                    )}
                    <CommentForm/>
                    <div className='bg-[#191919] rounded-lg p-3 mb-3 gap-y-3'>
                      {comments.length === 0 ? (
                        <p>No comments available.</p>
                      ) : (
                        comments.map((comment) => (
                          <Comment
                            key={comment.commentId}
                            commentId={comment.commentId}
                            userId={comment.userId}
                            time={comment.time}
                            content={comment.content}
                            likes={comment.likes}
                            dislikes={comment.dislikes}
                          />
                        ))
                      )}
                    </div>
                </div>
            </div>          
            <div className="col-span-1 bg-[#191919] rounded-lg h-full">
                Friends
            </div>
        </div>
    );
};

export default PostPage;
