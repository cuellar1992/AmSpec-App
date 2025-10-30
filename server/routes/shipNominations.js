import express from 'express';
import {
  getAllShipNominations,
  getShipNominationById,
  getShipNominationByRef,
  createShipNomination,
  updateShipNomination,
  deleteShipNomination,
  getShipNominationsByStatus,
  updateAllStatuses,
} from '../controllers/shipNominationController.js';

const router = express.Router();

// Base routes
router.route('/').get(getAllShipNominations).post(createShipNomination);

// Status update route
router.route('/update-statuses').post(updateAllStatuses);

// Status route
router.route('/status/:status').get(getShipNominationsByStatus);

// Reference uniqueness check
router.route('/ref/:amspecReference').get(getShipNominationByRef);

// ID-based routes
router
  .route('/:id')
  .get(getShipNominationById)
  .put(updateShipNomination)
  .delete(deleteShipNomination);

export default router;
