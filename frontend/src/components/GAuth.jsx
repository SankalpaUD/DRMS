import React from 'react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';

export default function GAuth() {
  const auth = getAuth(app);
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={handleGoogleLogin}
        className="relative flex items-center bg-white text-gray-700 px-4 py-2 border border-gray-500 rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-transform duration-300 hover:scale-105 w-full"
      >
        <AiFillGoogleCircle className="absolute left-4 text-2xl" />
        <span className="flex-grow text-center">Continue with Google</span>
      </button>
    </div>
  );
}