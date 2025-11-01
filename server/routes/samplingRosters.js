import express from 'express';
import {
  getAllSamplingRosters,
  getSamplingRosterById,
  getSamplingRosterByRef,
  createSamplingRoster,
  updateSamplingRoster,
  deleteSamplingRoster,
} from '../controllers/samplingRosterController.js';

const router = express.Router();

// Base routes
router.route('/').get(getAllSamplingRosters).post(createSamplingRoster);

// Reference lookup route
router.route('/ref/:amspecRef').get(getSamplingRosterByRef);

// ID-based routes
router
  .route('/:id')
  .get(getSamplingRosterById)
  .put(updateSamplingRoster)
  .delete(deleteSamplingRoster);

export default router;

