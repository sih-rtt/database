import redis from './redis';
import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const truncateTestStream = async () => {
  try {
    const entries = await redis.xRange('session:712', '-', '+');
    for (let i = 0; i < entries.length; i++) {
      await redis.xDel('session:712', entries[i].id);
    }
  } catch (e) {
    console.log(e)
    console.log(chalk.red.bold('Error:', chalk.white('Could not truncate Redis Bus repo.\n')));
  }
}

export const createTestStream = async () => {
  const pathName: PathOrFileDescriptor = path.resolve('src', 'data', 'routes.json');
  const routes = JSON.parse(fs.readFileSync(pathName, 'utf-8')).routesWithRef;

  const selectedRoutes: any[] = routes.filter((route: any) => route.type === 'relation' && route.tags.ref === 'V-500D');
  const busStops = selectedRoutes[1].members.filter((member: any) => member.type === 'node');

  for (let i = 0; i < busStops.length; i++) {
    const busStop: any[] = await prisma.$queryRaw`
      SELECT name,
      ST_X(ST_Transform(location, 4326)) as longitude,
      ST_Y(ST_Transform(location, 4326)) as latitude
      FROM "BusStop"
      WHERE "refId"=${busStops[i].ref};
    `;
    
    await redis.xAdd('session:712', '*', {
      latitude: Number(busStop[0].latitude).toString(),
      longitude: Number(busStop[0].longitude).toString()
    });
  }

}
