import { seedBusStops } from './bus-stop.js';
import { seedBuses } from './bus.js';
import { seedSuggest } from './suggest.js';
import { createTestStream, truncateTestStream } from './locations-stream.js';
import { seedCompleteRedis, truncateRedisRepos } from './main.js';
import { customClients, redisRepositories } from '@sih-rtt/dbclient';

const { prisma, redis } = customClients;
const {
  busRepo,
  busStopRepo,
  suggestRepo,
  conductorRepo,
  riderRepo
} = redisRepositories;

export {
  seedBusStops as SEED_REDIS_BUSSTOP,
  seedBuses as SEED_REDIS_BUSES,
  seedSuggest as SEED_REDIS_SUGGEST,
  seedCompleteRedis as SEED_REDIS,
  createTestStream as SEED_TEST_STREAM,
  truncateTestStream as TRUNCATE_TEST_STREAM,
  truncateRedisRepos as TRUNCATE_REDIS,
  prisma,
  redis,
  busRepo,
  busStopRepo,
  suggestRepo,
  conductorRepo,
  riderRepo
}
