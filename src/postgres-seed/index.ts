import { seedConductor } from './conductor.js';
import { seedBusStops } from './bus-stops.js';
import { seedBusRoutes } from './bus-routes.js';
import { seedCombinedBusRoutes } from './combined-routes.js';
import { seedBus } from './bus.js';
import { seedCompletePg, truncatePgTables } from './main.js';
import { customClients } from '@sih-rtt/dbclient';

const { prisma } = customClients;

export {
  seedConductor as SEED_POSTGRE_CONDUCTOR,
  seedBusStops as SEED_POSTGRE_BUSSTOP,
  seedBusRoutes as SEED_POSTGRE_BUSROUTE,
  seedCompletePg as SEED_POSTGRES,
  seedCombinedBusRoutes as SEED_POSTGRES_COMBINEDROUTE,
  seedBus as SEED_POSTGRES_BUS,
  truncatePgTables as TRUNCATE_POSTGRES,
  prisma
};
