import { prisma, busRepo } from './index.js';
import { Entity, EntityId } from 'redis-om';
import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import cliProgress from 'cli-progress';;

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

export const seedBuses = async () => {
  try{
    console.log('\n');

    const pathName = path.resolve('src', 'data', 'routes.json');
    const routes: any[] = JSON.parse(fs.readFileSync(pathName, 'utf-8')).routesWithRef;
    const buses =  await prisma.bus.findMany();

    progressBar.start(buses.length, 0);
    for (let i = 0; i < buses.length; i++) {
      const busRoute: any[] = routes.filter((route) => route.tags.ref === buses[i].busNo);
      
      const bus = busRoute.length === 2
      ? {
        id: buses[i].id ?? null,
        regNo: buses[i].regNo ?? null,
        busNo: buses[i].busNo ?? null,
        type: buses[i].type ?? null,
        info: JSON.stringify(buses[i].info) ?? null,
        routeA: busRoute[0].members
          .filter((member: any) => member.type === 'node')
          .map((member: any) => member.ref) ?? null,
        routeB: busRoute[1].members
          .filter((member: any) => member.type === 'node')
          .map((member: any) => member.ref) ?? null
      }
      : {
        id: buses[i].id ?? null,
        regNo: buses[i].regNo ?? null,
        busNo: buses[i].busNo ?? null,
        type: buses[i].type ?? null,
        info: JSON.stringify(buses[i].info) ?? null,
        routeA: busRoute[0].members
          .filter((member: any) => member.type === 'node')
          .map((member: any) => member.ref) ?? null,
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

export const truncateBus = async () => {
  try {
    const buses: Entity[] = await busRepo.search().return.all();
    if (!buses.length)
      return;
    for( let i = 0; i < buses.length; i++) {
      const bus: string = buses[i][EntityId] as string
      await busRepo.remove(bus);
    }

  } catch(e) {
    console.log(e)
    console.log(chalk.red.bold('Error:', chalk.white('Could not truncate Redis Bus repo.\n')));
  }
}
