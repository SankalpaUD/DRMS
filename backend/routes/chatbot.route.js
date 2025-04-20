import express from 'express';
import { handleWebhook } from '../controllers/chatbot.controller.js';

const router = express.Router();

// Define the webhook route
router.post('/webhook', handleWebhook);

export default router;