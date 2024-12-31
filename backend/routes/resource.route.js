import express from 'express';
import { verify } from '../utils/verify.js';
import upload from '../utils/multer.js';
import { AddResource, getResources, updateResource, deleteResource } from '../controllers/resource.controller.js';

const router = express.Router();

router.post('/add', verify(['Super Admin', 'Resource Admin']), upload.array('images', 6), AddResource);
router.get('/get', getResources);
router.put('/update/:id', verify(['Super Admin', 'Resource Admin']), updateResource);
router.delete('/delete/:id', verify(['Super Admin', 'Resource Admin']), deleteResource);

export default router;