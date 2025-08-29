import { server, initializeApp } from './app';
import { logger } from '@/utils/logger';

const PORT = process.env.PORT || 3000;

// Initialize and start the server
const startServer = async () => {
  try {
    // Initialize the application (database, etc.)
    await initializeApp();

    // Start the HTTP server
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Health check: http://localhost:${PORT}/health`);
      logger.info(`🔗 API base URL: http://localhost:${PORT}/api`);
      logger.info(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
