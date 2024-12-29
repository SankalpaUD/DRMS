import express from 'express';
import { verify } from '../utils/verify.js';
import { acceptBooking } from '../controllers/acceptance.controller.js';

const router = express.Router();

// Routes for Acceptance Admin
router.post('/accept', verify(['Acceptance Admin']), acceptBooking);

export default router;