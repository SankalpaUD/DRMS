import express from 'express';
import { verify } from '../utils/verify.js';
import upload from '../utils/multer.js';
import { AddResource, getResources, updateResource, deleteResource, getResourceById, createRequest, getAllRequests, approveRequest  } from '../controllers/resource.controller.js';

const router = express.Router();

router.post('/add', verify(['Super Admin', 'Resource Admin']), upload.array('images', 6), AddResource);
router.get('/get', getResources);
router.get('/get/:id', getResourceById);
router.put('/update/:id', verify(['Super Admin', 'Resource Admin']), updateResource);
router.delete('/delete/:id', verify(['Super Admin', 'Resource Admin']), deleteResource);
router.post('/request', verify(['user', 'student', 'staff']), createRequest);
router.get('/getRequest', verify(['Super Admin', 'Acceptance Admin']), getAllRequests);
router.put('/approveRequest/:id', verify(['Super Admin', 'Acceptance Admin']), approveRequest);

export default router;