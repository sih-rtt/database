import { prisma } from './index.js';
import fs from 'node:fs';
import chalk from 'chalk';
import path from 'node:path';
import cliProgress from 'cli-progress';;

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

export const seedBusRoutes = async () => {
  
  try{
    console.log('\n');

    const pathName = path.resolve('src','data','routes.json');
    const busRoutes: any[] = JSON.parse(fs.readFileSync(pathName, 'utf-8'))?.routesWithRef;

    const busStopPathname = path.resolve('src', 'data', 'bus-stops.json')
    const busStops: any[] = JSON.parse(fs.readFileSync(busStopPathname, 'utf-8'))?.busStops;

    progressBar.start(busRoutes.length, 0);
    for (let i = 0; i < busRoutes.length; i++) {
      const busStopMembers = busRoutes[i].members.filter((member: any) => member?.type === 'node')
      const createdRoute = await prisma.route.create({
        data: {
          refId: busRoutes[i]?.id,
          from: busRoutes[i]?.tags?.from ?? undefined,
          to: busRoutes[i]?.tags?.to ?? undefined,
          busStops: {
            create: busStopMembers.map((busStop: any) => {
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

      if (!busStopMembers.length)
        continue;

      const toBeFrom = busStops.filter((busStop: any) => busStop.id === busStopMembers.filter((busStop: any) => busStop.role === 'platform_entry_only')[0]?.ref);
      const busStopFrom = toBeFrom.length ? toBeFrom : busStops.filter((busStop: any) => busStop.id === busStopMembers[0].ref);

      const toBeTo = busStops.filter((busStop: any) => busStop.id === busStopMembers.filter((busStop: any) => busStop.role === 'platform_exit_only')[0]?.ref);
      const busStopTo = toBeTo.length ? toBeTo : busStops.filter((busStop: any) => busStop.id === busStopMembers[busStopMembers.length - 1].ref);

      await prisma.$executeRaw`
        UPDATE "Route"
        SET 
          "fromLocation"=ST_GeomFromText('POINT(' || ${busStopFrom[0].lon} || ' ' || ${busStopFrom[0].lat} || ')', 4326),
          "toLocation"=ST_GeomFromText('POINT(' || ${busStopTo[0].lon} || ' ' || ${busStopTo[0].lat} || ')', 4326)
        WHERE "id"=${createdRoute.id};
      `;

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
