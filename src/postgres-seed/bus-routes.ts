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
    return res.elements?.filter((elem: any) => elem?.type === 'relation');

  } catch(e) {
    console.log(chalk.red('Error: ', chalk.white('Could not fetch data\n')));
    console.log(e);
    process.exit(1);
  }
  
}

export const seedBusRoutes = async () => {

  const busRoutes: any[] = await getOsmData();
  
  try{
    console.log('\n');

    progressBar.start(busRoutes.length, 0);
    for (let i = 0; i < busRoutes.length; i++) {
      await prisma.route.create({
        data: {
          refId: busRoutes[i]?.id,
          from: busRoutes[i]?.tags?.from ?? undefined,
          to: busRoutes[i]?.tags?.to ?? undefined,
          busStops: {
            create: busRoutes[i].members.filter((member: any) =>
              member?.role === 'platform_entry_only' || member?.role === 'platform_exit_only' || member?.role === 'platform'
            ).map((busStop: any) => {
              return {
                busStop: {
                  connect: {
                    refId: busStop?.ref
                  }
                }
              }
            })
          }
        }
      });
      progressBar.update(i);
    }

    progressBar.update(busRoutes.length);
    progressBar.stop();
    console.log('\n', '\n', chalk.bold.green('Success:'), chalk.white.bold(`Successfully seeded "BusRoute" table with OSM data!\n`))

  } catch (e) {
    progressBar.stop();
    console.log(chalk.bold.redBright('\nError:'), chalk.bold.white('Cannot seed the "BusRoute" table of SQL database.\n'));
    console.log(e);
    process.exit(1);

  } finally {
    prisma.$disconnect();

  }
}
