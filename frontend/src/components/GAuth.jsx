import React, { useContext } from 'react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function GAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const response = await axios.post('/api/auth/google', {
        name: resultFromGoogle.user.displayName,
        email: resultFromGoogle.user.email,
        googlePhotoUrl: resultFromGoogle.user.photoURL,
      });

      const userData = response.data;
      setUser(userData);
      dispatch(loginSuccess(userData));
      navigate('/home');
    } catch (error) {
      dispatch(loginFailure(error.message));
      console.error('Google login failed', error);
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