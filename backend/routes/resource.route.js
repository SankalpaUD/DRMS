import express from 'express';
import { verify } from '../utils/verify.js';
import upload from '../utils/multer.js';
import { AddResource, getResources, updateResource, deleteResource, getResourceById, addTimetable, updateTimetable, deleteTimetable, getTimetables } from '../controllers/resource.controller.js';
import { createRequest, getRequests, getRequestById, approveRequest, rejectRequest, deleteRequest, getUserBookings, getUserBookingById } from '../controllers/request.controller.js';
import { reportIssue, getIssues, provideFeedback } from '../controllers/issue.controller.js';
import { addFulfillStaff, getAllFulfillStaff, updateFulfillStaff, deleteFulfillStaff } from '../controllers/fulfillstaff.controller.js';
import { createNotice, getNotices,deleteNotice } from '../controllers/notice.controller.js';

const router = express.Router();

router.post('/add', verify(['Super Admin', 'Resource Admin']), upload.array('images', 6), AddResource);
router.get('/get', getResources);
router.get('/get/:id', getResourceById);
router.get('/getUserBookings', verify(['user', 'student', 'staff']), getUserBookings);
router.get('/getUserBooking/:bookingId', verify(['user', 'student', 'staff']), getUserBookingById);
router.put('/update/:id', upload.array('images', 6), verify(['Super Admin', 'Resource Admin']), updateResource);
router.delete('/delete/:id', verify(['Super Admin', 'Resource Admin']), deleteResource);

router.post('/request', verify(['user', 'student', 'staff']), createRequest);
router.get('/getRequest', getRequests);
router.get('/getRequest/:id', getRequestById);
router.put('/approveRequest/:id', verify(['Super Admin', 'Acceptance Admin']), approveRequest);
router.put('/rejectRequest/:id', verify(['Super Admin', 'Acceptance Admin']), rejectRequest);
router.delete('/deleteRequest/:id', verify(['Super Admin', 'Acceptance Admin']), deleteRequest);

router.post('/reportIssue', verify(['user', 'student', 'staff']), upload.array('images', 5), reportIssue);
router.get('/getIssues', verify(['Super Admin', 'Resource Admin']), getIssues);
router.put('/provideFeedback/:id', verify(['Super Admin', 'Resource Admin']), provideFeedback);

router.post('/addTimetable', verify(['Super Admin', 'Resource Admin']), addTimetable);
router.put('/updateTimetable', verify(['Super Admin', 'Resource Admin']), updateTimetable);
router.delete('/deleteTimetable/:resourceId/:timetableId', verify(['Super Admin', 'Resource Admin']), deleteTimetable);
router.get('/getTimetables/:resourceId',verify(), getTimetables);
router.use('/fulfillstaff',verify(['Super Admin', 'Fulfillment Admin']), addFulfillStaff);

router.post('/addFulfillstaff', verify(['Super Admin', 'Fulfillment Admin']), addFulfillStaff);
router.get('/getFulfillstaffs', verify(['Super Admin', 'Fulfillment Admin']), getAllFulfillStaff);
router.put('/updateFulfillstaff/:id', verify(['Super Admin', 'Fulfillment Admin']), updateFulfillStaff);
router.delete('/deleteFulfillstaff/:id', verify(['Super Admin', 'Fulfillment Admin']), deleteFulfillStaff);

router.post('/notices', verify(['Super Admin', 'Resource Admin']), createNotice); 
router.delete('/notices/:id', verify(['Super Admin', 'Resource Admin']), deleteNotice);

export default router;