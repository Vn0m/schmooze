import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../../../lib/firebase'; 

// Handle POST request to like or unlike a post
export async function POST(req: NextRequest) {
  try {
    const { postId, userId, action } = await req.json();

    if (!postId || !userId || !action) {
      return NextResponse.json({ error: 'Post ID, user ID, and action are required.' }, { status: 400 });
    }

    // Reference to the Firestore document
    const postRef = doc(db, 'posts', postId);

    // Get the current post document
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      return NextResponse.json({ error: 'Post does not exist.' }, { status: 404 });
    }

    // Depending on the action, update the post document
    if (action === 'dislike') {
      await updateDoc(postRef, {
        likes: arrayUnion(userId)
      });
    } else if (action === 'undo dislike') {
      await updateDoc(postRef, {
        likes: arrayRemove(userId)
      });
    } else {
      return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
    }

    return NextResponse.json({ message: `Post ${action}d successfully.` });

  } catch (error) {
    console.error('Error disliking/undo disliking post:', error);
    return NextResponse.json({ error: 'Error liking/unliking post' }, { status: 500 });
  }
}
