import express from 'express';
import { getMostBookedResources, getMostReportedIssues, getTopBookers, getAllUsers } from '../controllers/analysis.controller.js';

const router = express.Router();

router.get('/most-booked', getMostBookedResources);
router.get('/most-reported', getMostReportedIssues);
router.get('/top-bookers', getTopBookers);
router.get('/users', getAllUsers);

export default router;