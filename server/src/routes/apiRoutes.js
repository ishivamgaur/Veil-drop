import { Router } from 'express';
import { peerController } from '../controllers/peerController.js';

const router = Router();

/**
 * @route GET /api/health
 * @desc Inspect system operational readiness and connection counts
 */
router.get('/health', peerController.getSystemHealth);

/**
 * @route GET /api/peers
 * @desc Retrieve list of currently registered active peers in the local mesh
 */
router.get('/peers', peerController.listActivePeers);

export default router;
