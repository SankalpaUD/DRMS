import express from 'express';
import upload from '../utils/multer.js';
import { verifyuser } from '../utils/verify.js';
import { test, updateUser, upgradeRequest, approveUpgradeRequest } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyuser, upload.single('avatar'), updateUser);
router.post('/upgrade-request', upgradeRequest);
router.post('/approve-upgrade-request', approveUpgradeRequest);

export default router;