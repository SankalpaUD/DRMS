import express from 'express';
import { signup, login, google, logout, getCurrentUser } from '../controllers/auth.controller.js';
import { verify } from '../utils/verify.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', google);
router.post('/logout', logout);
router.get('/me', verify(), getCurrentUser); // Add /me route

export default router;