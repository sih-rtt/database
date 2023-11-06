import { PrismaClient } from '@prisma/client';
import { fakerEN_IN as faker } from '@faker-js/faker';
import _ from 'lodash';
import chalk from 'chalk';
import { createId } from '@paralleldrive/cuid2';
const cliProgress = require('cli-progress');

const prisma = new PrismaClient();
faker.seed(parseInt(process.env.SEED as string));

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

export const getOsmData = async () => {
  console.log(chalk.green('\nFetching OSM data...'))
  try {
    const res = await fetch(
        'https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3Barea%28id%3A3607902476%29-%3E.a%3B%28relation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22bus%22%5D%28area.a%29%3B%3E%3Bnode%28r%29%3B%29%3Bout%3B'
      )
      .then(
        (data: any) => data.json()
      );
    return res.elements?.filter((elem: any) => elem?.type === 'node');

  } catch(e) {
    console.log(chalk.red('Error: ', chalk.white('Could not fetch data\n')));
    console.log(e);
    process.exit(1);
  }
  
}

export const seedBusStops = async () => {
  const busStops: any[] = await getOsmData();
  
  try{
    console.log('\n');

    progressBar.start(busStops.length, 0);
    for (let i = 0; i < busStops.length; i++) {
      if (!busStops[i].tags?.name)
        await prisma.$executeRaw`
          INSERT INTO "BusStop" (id, location, name, "refId") 
          VALUES (
            ${createId() as string}, 
            ST_GeomFromText('POINT(' || ${busStops[i].lon as string} || ' ' || ${busStops[i].lat as string} || ')', 4326), 
            'unnamed', 
            ${busStops[i].id}
          );
        `;
      else
        await prisma.$executeRaw`
          INSERT INTO "BusStop" (id, location, name, "refId") 
          VALUES (
            ${createId() as string}, 
            ST_GeomFromText('POINT(' || ${busStops[i].lon as string} || ' ' || ${busStops[i].lat as string} || ')', 4326), 
            ${busStops[i].tags.name as string}, 
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
