import express from 'express';
import { acceptBooking, approveUpgradeRequest, getAllUpgradeRequests, getUpgradeRequestById } from '../controllers/acceptance.controller.js';
import { verify } from '../utils/verify.js';

const router = express.Router();

router.post('/accept-booking', verify(['Acceptance Admin']), acceptBooking);
router.post('/approve-upgrade', verify(['Acceptance Admin']), approveUpgradeRequest);
router.get('/upgrade-requests', verify(['Acceptance Admin']), getAllUpgradeRequests);
router.get('/upgrade-requests/:requestId', verify(['Acceptance Admin']), getUpgradeRequestById);

export default router;