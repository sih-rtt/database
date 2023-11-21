import { PrismaClient } from '@prisma/client';
import path from 'node:path';
import fs from 'node:fs';
import chalk from 'chalk';
import { createId } from '@paralleldrive/cuid2';
import cliProgress from 'cli-progress';;

const prisma = new PrismaClient();

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);


export const seedBusStops = async () => {
  
  try{
    console.log('\n');

    const pathName = path.resolve('src','data','bus-stops.json');
    const busStops: any[] = JSON.parse(fs.readFileSync(pathName, 'utf-8')).busStops;

    progressBar.start(busStops.length, 0);
    for (let i = 0; i < busStops.length; i++) {
      await prisma.$executeRaw`
        INSERT INTO "BusStop" (id, location, name, "refId") 
        VALUES (
          ${createId() as string}, 
          ST_GeomFromText('POINT(' || ${busStops[i].lon as string} || ' ' || ${busStops[i].lat as string} || ')', 4326), 
          ${busStops[i].tags?.name as string ?? 'unnamed'},
          ${busStops[i].id}
        );
      `;
      progressBar.update(i);
    }

    progressBar.update(busStops.length);
    progressBar.stop();
    console.log('\n', '\n', chalk.bold.green('Success:'), chalk.white.bold(`Successfully seeded "BusStop" table with OSM data!\n`))

  } catch (e) {
    progressBar.stop();
    console.log(chalk.bold.redBright('\nError:'), chalk.bold.white('Cannot seed the "BusStop" table of SQL database.\n'));
    console.log(e);
    process.exit(1);

  } finally {
    prisma.$disconnect();

  }
}
