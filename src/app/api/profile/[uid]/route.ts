import { db } from '../../../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { uid: string } }) {
  const { uid } = params;

  if (!uid) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userDoc.data(), { status: 200 });
  } catch (error) {
    console.error('Error fetching profile from Firestore:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
