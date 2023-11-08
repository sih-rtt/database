import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import chalk from 'chalk';
import path from 'node:path';
const cliProgress = require('cli-progress');

const prisma = new PrismaClient();

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

export const seedCombinedBusRoutes = async () => {
  
  try{
    console.log('\n');

    const pathName: PathOrFileDescriptor = path.resolve('src','data','combined-routes.json');
    const combindeRoutes: any = JSON.parse(fs.readFileSync(pathName, 'utf-8'))?.combinedRoutes;

    const busRefs: any[] = Object.keys(combindeRoutes)

    progressBar.start(busRefs.length, 0);
    for (let i = 0; i < busRefs.length; i++) {
      await prisma.combinedRoute.createMany({
        data: combindeRoutes[busRefs[i]].length === 1
        ?  {
          busRef: busRefs[i],
          routeIdA: combindeRoutes[busRefs[i]][0]
        }
        : {
          busRef: busRefs[i],
          routeIdA: combindeRoutes[busRefs[i]][0],
          routeIdB: combindeRoutes[busRefs[i]][1]
        },
        skipDuplicates: true
      });
      progressBar.update(i);
    }

    progressBar.update(combindeRoutes.length);
    progressBar.stop();
    console.log('\n', '\n', chalk.bold.green('Success:'), chalk.white.bold(`Successfully seeded "CombinedRoute" table with OSM data!\n`))

  } catch (e) {
    progressBar.stop();
    console.log(chalk.bold.redBright('\nError:'), chalk.bold.white('Cannot seed the "CombinedRoute" table of SQL database.\n'));
    console.log(e);
    process.exit(1);

  } finally {
    prisma.$disconnect();

  }
}
