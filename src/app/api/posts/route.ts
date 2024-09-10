import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, getDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase'; 

// Handle GET request
export async function GET(req: NextRequest) {
  try {
    const postsRef = collection(db, 'posts');
    const snapshot = await getDocs(postsRef);

    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
  }
}

// Handle POST request
export async function POST(req: NextRequest) {
  try {
    const { title, content, userId } = await req.json();

    if (!title || !content || !userId) {
      return NextResponse.json({ error: 'Title, content, and userId are required.' }, { status: 400 });
    }

    // Check if user exists
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: 'User does not exist.' }, { status: 404 });
    }

    // Add new post to Firestore
    const postsRef = collection(db, 'posts');
    console.log(postsRef)
    const docRef = await addDoc(postsRef, {
      content: content,
      title: title,
      time: new Date().toISOString(), // Add timestamp
      userId: userId,
      likes: 0,
      dislikes: 0,
      comments: []
    });

    return NextResponse.json({ id: docRef.id, title, content, userId }, { status: 201 });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Error creating post' }, { status: 500 });
  }
}

// Handle DELETE request
export async function DELETE(req: NextRequest) {
  try {
    // Parse the request body to get the post ID
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required.' }, { status: 400 });
    }

    // Reference to the Firestore document
    const postRef = doc(db, 'posts', id);

    // Delete the document from Firestore
    await deleteDoc(postRef);

    return NextResponse.json({ message: 'Post deleted successfully.' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Error deleting post' }, { status: 500 });
  }
}
