import express from 'express';
import upload from '../utils/multer.js';
import { verify } from '../utils/verify.js';
import { updateUser, createUpgradeRequest, approveUpgradeRequest, getAllUpgradeRequests, getUpgradeRequestById } from '../controllers/user.controller.js';
import { getNotifications, markAsRead } from '../controllers/notification.controller.js';

const router = express.Router();

router.post('/update/:id', verify(), upload.single('avatar'), updateUser);
router.post('/upgrade-request', verify(), upload.fields([{ name: 'idFrontImage' }, { name: 'idBackImage' }]), createUpgradeRequest);
router.post('/approve-upgrade', verify(['Acceptance Admin']), approveUpgradeRequest);
router.get('/upgrade-requests', verify(['Acceptance Admin']), getAllUpgradeRequests);
router.get('/upgrade-requests/:requestId', verify(['Acceptance Admin']), getUpgradeRequestById);
router.get('/notifications/:userId', verify(), getNotifications);
router.put('/notifications/markAsRead/:id', verify(), markAsRead);

export default router;