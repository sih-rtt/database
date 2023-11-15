import { createClient } from 'redis';
import { Repository, Schema } from 'redis-om';

const redis = createClient();
redis.on('error', (error) => {
  console.log(error)
});

await redis.connect();

const busStop = new Schema('BusStop', {
  id: { type: 'string' },
  refId: { type: 'number' },
  location: { type: 'point' },
  name: { type: 'string' }
});

const bus = new Schema('Bus', {
  id: { type: 'string' },
  regNo: { type: 'string' },
  busNo: { type: 'string' },
  location: { type: 'point' },
  type: { type: 'string' },
  info: { type: 'text' },
  routeA: { type: 'number[]' },
  routeB: { type: 'number[]' }
});

const suggest = new Schema('Suggest', {
  suggestTerm: { type: 'text' },
  type: { type: 'string' },
  refId: { type: 'string' }
});

const user = new Schema('User', {
  email: { type: 'string' },
  accessTokens: { type: 'string[]' },
  refreshTokens: { type: 'string[]' },
});

const conductor = new Schema('Concductor', {
  conductorid: { type: 'string' },
  loggedIn: { type: 'boolean' },
  access: { type: 'string' },
  refresh: { type: 'string' },
});

export const riderRepo = new Repository(user, redis);
export const conductorRepo = new Repository(conductor, redis);
export const busStopRepo = new Repository(busStop, redis);
export const busRepo = new Repository(bus, redis);
export const suggestRepo = new Repository(suggest, redis);
export default redis;

await busStopRepo.createIndex();
await busRepo.createIndex();
await suggestRepo.createIndex();
