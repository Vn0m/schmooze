import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../lib/firebaseAdmin';


// creates custom token for firebase authentication
export async function POST(req: NextRequest) {
    try {
      const { userId } = await req.json();
      const customToken = await auth.createCustomToken(userId);
      console.log('Custom token created');
      return NextResponse.json({ token: customToken });
    } catch (error) {
      console.error('Error creating custom token:', error);
      return NextResponse.json({ error: 'Error creating custom token' }, { status: 500 });
    }
  }
  