import { busStopRepo } from './redis';
import { PrismaClient } from '@prisma/client';
import chalk from 'chalk';
const cliProgress = require('cli-progress');

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const prisma = new PrismaClient();


export const seedBusStops = async () => {
  try{
    console.log('\n');

    const busStops: any[] =  await prisma.$queryRaw`
      SELECT
        id, "refId",
        name,
        ST_X(ST_Transform(location, 4326)) as longitude,
        ST_Y(ST_Transform(location, 4326)) as latitude
      FROM "BusStop";
    `

    progressBar.start(busStops.length, 0);
    for (let i = 0; i < busStops.length; i++) {
      const busStop = {
        id: busStops[i].id,
        refId: Number(busStops[i].refId),
        location: {
          longitude: busStops[i].longitude,
          latitude: busStops[i].latitude
        },
        name: busStops[i].name
      }

      await busStopRepo.save(busStop);
      progressBar.update(i);
    }

    progressBar.update(busStops.length);
    progressBar.stop();
    console.log('\n', '\n', chalk.bold.green('Success:'), chalk.white.bold(`Successfully seeded "BusStop" Repository with Postgres data!\n`))

  } catch (e) {
    progressBar.stop();
    console.log(chalk.bold.redBright('\nError:'), chalk.bold.white('Cannot seed the "BusStop" Repository of Redis database.\n'));
    console.log(e);
    process.exit(1);

  }
}
