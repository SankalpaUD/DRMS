import express from 'express';
import upload from '../utils/multer.js';
import { verify } from '../utils/verify.js';
import { getAllUsers, updateUser, deleteUser, createUpgradeRequest, approveUpgradeRequest, getAllUpgradeRequests, getUpgradeRequestById, changePassword } from '../controllers/user.controller.js';
import { getNotifications, markAsRead } from '../controllers/notification.controller.js';
import { getNotices } from '../controllers/notice.controller.js';

const router = express.Router();

// User management routes
router.get('/getusers', verify(['Super Admin']), getAllUsers);
router.put('/updateuser/:id', verify(['Super Admin', 'User']), upload.single('avatar'), updateUser);
router.delete('/deleteuser/:id', verify(['Super Admin', 'User']), deleteUser);
router.post('/change-password/:id', verify(), changePassword);

// Upgrade request routes
router.post('/upgrade-request', verify(), upload.fields([{ name: 'idFrontImage' }, { name: 'idBackImage' }]), createUpgradeRequest);
router.post('/approve-upgrade', verify(['Super Admin', 'Acceptance Admin']), approveUpgradeRequest);
router.get('/upgrade-requests', verify(['Super Admin', 'Acceptance Admin']), getAllUpgradeRequests);
router.get('/upgrade-requests/:requestId', verify(['Super Admin', 'Acceptance Admin']), getUpgradeRequestById);


// Notification routes
router.get('/notifications/:userId', verify(), getNotifications);
router.put('/notifications/markAsRead/:id', verify(), markAsRead);

//notices routes
router.get('/notices', verify(['Super Admin', 'Resource Admin', 'user']), getNotices);

export default router;