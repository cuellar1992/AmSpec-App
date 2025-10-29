import express from 'express';
import {
  getAllShipNominations,
  getShipNominationById,
  createShipNomination,
  updateShipNomination,
  deleteShipNomination,
  getShipNominationsByStatus,
} from '../controllers/shipNominationController.js';

const router = express.Router();

// Base routes
router.route('/').get(getAllShipNominations).post(createShipNomination);

// Status route
router.route('/status/:status').get(getShipNominationsByStatus);

// ID-based routes
router
  .route('/:id')
  .get(getShipNominationById)
  .put(updateShipNomination)
  .delete(deleteShipNomination);

export default router;
