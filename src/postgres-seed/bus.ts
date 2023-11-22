import { prisma } from './index.js';
import fs from 'node:fs';
import path from 'node:path';
import _ from 'lodash';
import { fakerEN_IN as faker } from '@faker-js/faker';
import chalk from 'chalk';
import cliProgress from 'cli-progress';;

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const infoArray = [ 'electric', 'cng', 'petrol', 'petrol', 'petrol']

faker.seed(parseInt(process.env.SEED as string));

export const seedBus = async () => {
  try{
    console.log('\n');

    const pathName = path.resolve('src', 'data', 'buses.json');
    const buses: string[] = JSON.parse(fs.readFileSync(pathName, 'utf-8')).buses;

    progressBar.start(buses.length, 0);
    for(let i = 0; i < buses.length; i++) {

      const { id } = await prisma.combinedRoute.findUniqueOrThrow({
        where: {
          busRef: buses[i]
        }
      });

      await prisma.bus.createMany({
        data: {
          regNo: faker.vehicle.vin(),
          busNo: buses[i],
          routeId: id,
          type: 'intracity',
          info: {
            'fuel': infoArray[_.random(0, 4)]
          }
        },
        skipDuplicates: true
      });

      progressBar.update(i)
    }
    progressBar.update(buses.length);
    progressBar.stop();
    console.log('\n', '\n', chalk.bold.green('Success:'), chalk.white.bold(`Successfully seeded "Bus" table with OSM data!\n`))

  } catch (e) {
    progressBar.stop();
    console.log(chalk.bold.redBright('\nError:'), chalk.bold.white('Cannot seed the "Bus" table of SQL database.\n'));
    console.log(e);
    process.exit(1);

  } finally {
    prisma.$disconnect();

  }
  
}