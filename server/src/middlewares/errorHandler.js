import { logger } from "../utils/logger.js";

/**
 * HTTP Request Logger Middleware
 * Traces API invocations with response latency tracking.
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      `HTTP ${req.method} ${req.originalUrl} -> Status: ${res.statusCode} (${duration}ms)`,
    );
  });
  next();
};

/**
 * Global Error Intercepting Middleware
 * Captures unhandled runtime exceptions and returns formatted JSON error structures.
 */
export const errorHandler = (err, req, res, next) => {
  logger.error("Unhandled Server Exception:", err);
  res.status(500).json({
    success: false,
    error: "Internal Server Protocol Exception",
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred."
        : err.message,
  });
};

/**
 * 404 Not Found Router Fallback
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint Not Recognized",
    path: req.originalUrl,
  });
};
