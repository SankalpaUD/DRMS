import express from 'express';
import { verify } from '../utils/verify.js';
import upload from '../utils/multer.js';
import { AddResource, getResources, updateResource, deleteResource, getResourceById, addTimetable, updateTimetable, deleteTimetable, getTimetables } from '../controllers/resource.controller.js';
import { createRequest, getAllRequests, approveRequest, getUserBookings } from '../controllers/request.controller.js';
import { reportIssue, getIssues, provideFeedback } from '../controllers/issue.controller.js';
import { addFulfillStaff, getAllFulfillStaff, updateFulfillStaff, deleteFulfillStaff } from '../controllers/fulfillstaff.controller.js';

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
router.post('/addTimetable', verify(['Super Admin', 'Resource Admin']), addTimetable);
router.put('/updateTimetable', verify(['Super Admin', 'Resource Admin']), updateTimetable);
router.delete('/deleteTimetable/:resourceId/:timetableId', verify(['Super Admin', 'Resource Admin']), deleteTimetable);
router.get('/getTimetables/:resourceId', verify(['Super Admin', 'Resource Admin']), getTimetables);
router.use('/fulfillstaff',verify(['Super Admin', 'Fulfillment Admin']), addFulfillStaff);
router.post('/addFulfillstaff', verify(['Super Admin', 'Fulfillment Admin']), addFulfillStaff);
router.get('/getFulfillstaffs', verify(['Super Admin', 'Fulfillment Admin']), getAllFulfillStaff);
router.put('/updateFulfillstaff/:id', verify(['Super Admin', 'Fulfillment Admin']), updateFulfillStaff);
router.delete('/deleteFulfillstaff/:id', verify(['Super Admin', 'Fulfillment Admin']), deleteFulfillStaff);

export default router;