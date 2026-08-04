import express from 'express';
import http from 'http';
import cors from 'cors';
import { CONFIG } from './config/constants.js';
import { logger } from './utils/logger.js';
import { requestLogger, errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import apiRoutes from './routes/apiRoutes.js';
import { signalingService } from './services/signalingService.js';

/**
 * Server Application Bootstrap
 * Configures Express runtime, mounts security policies, and binds real-time WebSocket signaling.
 */
const app = express();
const httpServer = http.createServer(app);

// Core Middleware Configuration
app.use(cors({ origin: CONFIG.CLIENT_ORIGIN }));
app.use(express.json());
app.use(requestLogger);

// REST API Route Mounts
app.use('/api', apiRoutes);

// Error Interception Fallbacks
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize Real-time WebSocket Service
signalingService.initialize(httpServer, CONFIG.CLIENT_ORIGIN);

// Start HTTP Listener
httpServer.listen(CONFIG.PORT, () => {
  logger.info(`=======================================================`);
  logger.info(`🌐 ${CONFIG.APP_NAME} operational on Port: ${CONFIG.PORT}`);
  logger.info(`🛡️ Mode: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`📡 WebSocket Signaling active & ready for discovery`);
  logger.info(`=======================================================`);
});

// Handle graceful process shutdowns
process.on('SIGINT', () => {
  logger.info('Received SIGINT. Gracefully terminating connections...');
  httpServer.close(() => {
    logger.info('Server cleanly stopped. Goodbye!');
    process.exit(0);
  });
});
