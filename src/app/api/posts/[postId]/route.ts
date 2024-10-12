
import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, getDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase'; 

// Handle GET request
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const postId = searchParams.get('postId'); 

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


