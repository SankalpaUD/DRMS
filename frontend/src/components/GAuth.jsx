import React from 'react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function GAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          googlePhotoUrl: resultFromGoogle.user.photoURL
        }),
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(loginSuccess(data));
        navigate('/home');
      }
    } catch (error) {
      console.log(error);
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