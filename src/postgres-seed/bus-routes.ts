import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import chalk from 'chalk';
import path from 'node:path';
const cliProgress = require('cli-progress');

const prisma = new PrismaClient();

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

export const seedBusRoutes = async () => {
  
  try{
    console.log('\n');

    const pathName: PathOrFileDescriptor = path.resolve('src','data','routes.json');
    const busRoutes: any[] = JSON.parse(fs.readFileSync(pathName, 'utf-8'))?.routesWithRef;

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
