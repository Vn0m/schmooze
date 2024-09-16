import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
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
      text: comment.text, // Comment content
      likes: 0, 
      dislikes: 0, 
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
