import { NextResponse, NextRequest } from "next/server";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { auth, db } from '../../../../lib/firebase';

export async function POST(req: NextRequest){
    try{
        const { content } = await req.json();
        if(!content){
            return NextResponse.json({error: "All fields are required"},{status: 400});
        }

        if(content.password !== content.confirmPassword){
            return NextResponse.json({error: "Passwords do not match"}, {status: 404});
        }
        // checks if email and username already exist
      const usernameQuery = query(
        collection(db, 'users'),
        where('username', '==', content.username)
      );
      const querySnapshot = await getDocs(usernameQuery);

      if (!querySnapshot.empty) {
        return NextResponse.json({error: 'Username is already taken.'}, {status: 404 });
      }

      const emailQuery = query(
        collection(db, 'users'),
        where('email', '==', content.email)
      );
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        return NextResponse.json({error: 'Email is already used.'}, {status: 404 });
      }

      const userCredential = await createUserWithEmailAndPassword(auth, content.email, content.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        username: content.username,
        images: {
            imageHeight: null,
            imageWidth: null,
            profileUrl: null,
        },
        createdAt: new Date(),
      });

      return NextResponse.json({content}, {status: 201});

    }catch(err){
        console.error("Error signing up: ",err);
        return NextResponse.json({error: "Failed to sign up, try again."}, {status: 500});
    }
}
