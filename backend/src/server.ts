import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import dotenv from 'dotenv';
import authPlugin from './middleware/auth';
import { requestIdHook } from './middleware/requestId';
import { runMigrations } from './db/migrate';

// Routes
import { authRoutes } from './routes/auth';
import { filingsRoutes } from './routes/filings';
import { sectionsRoutes } from './routes/sections';
import { flagsRoutes } from './routes/flags';
import { certificationRoutes } from './routes/certifications';
import { dueDiligenceRoutes } from './routes/dueDiligence';
import { adminRoutes } from './routes/admin';
import { enterpriseRoutes } from './routes/enterprise';

// Load environment variables
dotenv.config();

const port = parseInt(process.env.PORT || '3001', 10);

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Register Plugins
fastify.register(cors, { origin: true });
fastify.register(multipart, {
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});
fastify.register(authPlugin);

// Global hooks
fastify.addHook('onRequest', requestIdHook);

// Register Routes
fastify.register(authRoutes);
fastify.register(filingsRoutes);
fastify.register(sectionsRoutes);
fastify.register(flagsRoutes);
fastify.register(certificationRoutes);
fastify.register(dueDiligenceRoutes);
fastify.register(adminRoutes);
fastify.register(enterpriseRoutes);

// Error Handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  const reqId = (request as any).requestId || 'unknown';
  reply.status(500).send({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: error.message || 'An unexpected error occurred',
      requestId: reqId,
    },
  });
});

// Start Server
const start = async () => {
  try {
    // Run DB Migrations
    runMigrations();

    await fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(`Server running at http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
