import express from 'express';
import upload from '../utils/multer.js';
import { verify } from '../utils/verify.js';
import { test, updateUser, createUpgradeRequest } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verify(), upload.single('avatar'), updateUser);
router.post('/upgrade-request', verify(), upload.fields([{ name: 'idFrontImage' }, { name: 'idBackImage' }]), createUpgradeRequest);

export default router;