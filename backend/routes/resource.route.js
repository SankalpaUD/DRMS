import express from 'express';
import { verify } from '../utils/verify.js';
import upload from '../utils/multer.js';
import { AddResource, getResources, updateResource, deleteResource, getResourceById, createRequest, getAllRequests, approveRequest, getUserBookings, reportIssue, getIssues, provideFeedback } from '../controllers/resource.controller.js';

const router = express.Router();

router.post('/add', verify(['Super Admin', 'Resource Admin']), upload.array('images', 6), AddResource);
router.get('/get', getResources);
router.get('/get/:id', getResourceById);
router.get('/getUserBookings', verify(['user', 'student', 'staff']), getUserBookings);
router.put('/update/:id', upload.array('images', 6), verify(['Super Admin', 'Resource Admin']), updateResource);
router.delete('/delete/:id', verify(['Super Admin', 'Resource Admin']), deleteResource);
router.post('/request', verify(['user', 'student', 'staff']), createRequest);
router.get('/getRequest', getAllRequests);
router.put('/approveRequest/:id', verify(['Super Admin', 'Acceptance Admin']), approveRequest);
router.post('/reportIssue', verify(['user', 'student', 'staff']), reportIssue);
router.get('/getIssues', verify(['Super Admin', 'Resource Admin']), getIssues);
router.put('/provideFeedback/:id', verify(['Super Admin', 'Resource Admin']), provideFeedback);

export default router;