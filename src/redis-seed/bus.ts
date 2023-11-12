import { busRepo } from './redis';
import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
const cliProgress = require('cli-progress');

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const prisma = new PrismaClient();


export const seedBuses = async () => {
  try{
    console.log('\n');

    const pathName: PathOrFileDescriptor = path.resolve('src', 'data', 'routes.json');
    const routes: any[] = JSON.parse(fs.readFileSync(pathName, 'utf-8')).routesWithRef;
    const buses =  await prisma.bus.findMany();

    progressBar.start(buses.length, 0);
    for (let i = 0; i < buses.length; i++) {
      const busRoute: any[] = routes.filter((route) => route.tags.ref === buses[i].busNo);
      
      const bus = busRoute.length === 2
      ? {
        id: buses[i].id,
        regNo: buses[i].regNo,
        busNo: buses[i].busNo,
        type: buses[i].type,
        info: JSON.stringify(buses[i].info),
        routeA: busRoute[0].members
          .filter((member: any) => member.type === 'node')
          .map((member: any) => member.ref),
        routeB: busRoute[1].members
          .filter((member: any) => member.type === 'node')
          .map((member: any) => member.ref)
      }
      : {
        id: buses[i].id,
        regNo: buses[i].regNo,
        busNo: buses[i].busNo,
        type: buses[i].type,
        info: JSON.stringify(buses[i].info),
        routeA: busRoute[0].members
          .filter((member: any) => member.type === 'node')
          .map((member: any) => member.ref),
      }

      await busRepo.save(bus);
      progressBar.update(i);
    }

    progressBar.update(buses.length);
    progressBar.stop();
    console.log('\n', '\n', chalk.bold.green('Success:'), chalk.white.bold(`Successfully seeded "Bus" Repository with Postgres data!\n`))

  } catch (e) {
    progressBar.stop();
    console.log(chalk.bold.redBright('\nError:'), chalk.bold.white('Cannot seed the "Bus" Repository of Redis database.\n'));
    console.log(e);
    process.exit(1);

  }
}
