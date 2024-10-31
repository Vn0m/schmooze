import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, arrayUnion, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../../../lib/firebase';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library for generating unique comment IDs

// Handle POST request to add a comment
export async function POST(req: NextRequest) {
  try {
    const { postId, userId, comment } = await req.json();

    if (!postId || !userId || !comment) {
      return NextResponse.json({ error: 'Post ID, user ID, and comment text are required.' }, { status: 400 });
    }

    // Reference to the Firestore document
    const postRef = doc(db, 'posts', postId);

    // Get the current post document
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      return NextResponse.json({ error: 'Post does not exist.' }, { status: 404 });
    }

    // Create a new comment object with the required fields
    const newComment = {
      commentId: uuidv4(), // Generate a unique comment ID
      userId,
      time: new Date().toISOString(), // Add timestamp
      content: comment.text, // Comment content
      likes: [], 
      dislikes: [], 
    };

    // Update the post document with the new comment
    await updateDoc(postRef, {
      comments: arrayUnion(...[newComment]) // Add the new comment to the comments array
    });

    return NextResponse.json({ message: 'Comment added successfully.' });

  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Error adding comment' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const { postId } = params;
    if(postId) {
      const postDocRef = doc(db, 'posts', postId);
      const postDocSnapshot = await getDoc(postDocRef);

      if (postDocSnapshot.exists()) {
          const postData = postDocSnapshot.data(); 
          console.log(postData)
          const comments = postData.comments;

        return NextResponse.json({ comments });
      } else {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
  }
}
