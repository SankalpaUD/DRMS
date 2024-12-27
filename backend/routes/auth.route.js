import express from 'express';
import { signup, login, google, logout } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', google);
router.post('/logout', logout);

export default router;