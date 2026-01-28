import { createClient } from 'redis';

const globalForRedis = globalThis as unknown as {
  redis: ReturnType<typeof createClient> | undefined;
};

export const redis =
  globalForRedis.redis ??
  createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

// Connect to Redis
if (!redis.isOpen) {
  redis.connect().catch((error) => {
    console.error('Failed to connect to Redis:', error);
  });
}

// Handle Redis errors
redis.on('error', (error) => {
  console.error('Redis error:', error);
});

export default redis;
