
import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, getDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase'; 

// Handle GET request
export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
    try {
        const { postId } = params;

        if(postId) {
            const postsRef = doc(db, 'posts', postId);
            const snapshot = await getDoc(postsRef);

            if (snapshot.exists()) {
              const post = { id: postId, ...snapshot.data() }; 
              return NextResponse.json({ post });
            } else {
              return NextResponse.json({ error: 'Post not found' }, { status: 404 });
            }
        } else {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
    }
}


