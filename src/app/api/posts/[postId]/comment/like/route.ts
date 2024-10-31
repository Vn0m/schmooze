import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase'; 

// Handle POST request to like or unlike a comment
export async function POST(req: NextRequest) {
  try {
    const { commentId, userId, action } = await req.json();

    if (!commentId || !userId || !action) {
      return NextResponse.json({ error: 'Comment ID, user ID, and action are required.' }, { status: 400 });
    }

    // Reference to the Firestore document
    const postRef = doc(db, 'comments', commentId);

    // Get the current post document
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      return NextResponse.json({ error: 'Comment does not exist.' }, { status: 404 });
    }

    // Depending on the action, update the post document
    if (action === 'like') {
      await updateDoc(postRef, {
        likes: arrayUnion(userId)
      });
    } else if (action === 'unlike') {
      await updateDoc(postRef, {
        likes: arrayRemove(userId)
      });
    } else {
      return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
    }

    return NextResponse.json({ message: `Comment ${action}d successfully.` });

  } catch (error) {
    console.error('Error liking/unliking comment:', error);
    return NextResponse.json({ error: 'Error liking/unliking comment' }, { status: 500 });
  }
}
