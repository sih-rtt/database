import chalk from 'chalk';
import { PrismaClient } from '@prisma/client';
import { seedBusRoutes } from './bus-routes';
import { seedBusStops } from './bus-stops';
import { seedCombinedBusRoutes } from './combined-routes';
import { seedConductor } from './conductor';
import { seedBus } from './bus';
import { PREPARE_DATA } from '../prepare';
import fs from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();

export const seedCompletePg = async (numRecords: number) => {

  await truncatePgTables();

  if (!fs.existsSync(path.resolve('src', 'data'))){
    fs.mkdirSync(path.resolve('src', 'data'), { recursive: true });
    await PREPARE_DATA();
  } else {
    console.log(chalk.bold(
      `
        Data seems to be prepared already. 
        If you think the data is not prepared,
        or is too old,
        or you get an error because of the prepared data,
        please prepare the data again bye using\n 
        bun src/index.ts prepare
      `
    ));
  }

  console.log(
    chalk.white('Running', chalk.bold(5), 'jobs:\n'),
    chalk.white.bold('\t1. Seed Conductor\n'),
    chalk.white.bold('\t2. Seed BusStop\n'),
    chalk.white.bold('\t3. Seed BusRoute\n'),
    chalk.white.bold('\t4. Seed CombinedRoute\n'),
    chalk.white.bold('\t5. Seed Bus')
  )

  await seedConductor(numRecords);
  console.log(chalk.white('Completed job (1/5): ', chalk.bold('Seed Conductor ', chalk.green('✅'))));

  await seedBusStops();
  console.log(chalk.white('Completed job (2/5): ', chalk.bold('Seed BusStop ', chalk.green('✅'))));

  await seedBusRoutes();
  console.log(chalk.white('Completed job (3/5): ', chalk.bold('Seed BusRoute ', chalk.green('✅'))));

  await seedCombinedBusRoutes();
  console.log(chalk.white('Completed job (4/5): ', chalk.bold('Seed CombinedRoute ', chalk.green('✅'))));

  await seedBus();
  console.log(chalk.white('Completed job (5/5): ', chalk.bold('Seed Bus ', chalk.green('✅'))));
}

export const truncatePgTables = async () => {
  console.log(
    chalk.white('Running', chalk.bold(4), 'jobs:\n'),
    chalk.white.bold('\t1. Truncate Conductor\n'),
    chalk.white.bold('\t2. Truncate BusStop\n'),
    chalk.white.bold('\t3. Truncate BusRoute\n'),
    chalk.white.bold('\t4. Truncate CombinedRoute')
  );
  await prisma.$executeRaw`TRUNCATE TABLE \"Conductor\" CASCADE;`;
  console.log(chalk.white('Completed job (1/5): ', chalk.bold('Truncate Conductor ', chalk.green('✅'))));
  await prisma.$executeRaw`TRUNCATE TABLE \"BusStop\" CASCADE;`;
  console.log(chalk.white('Completed job (2/5): ', chalk.bold('Truncate BusStop ', chalk.green('✅'))));
  await prisma.$executeRaw`TRUNCATE TABLE \"Route\" CASCADE;`;
  console.log(chalk.white('Completed job (3/5): ', chalk.bold('Truncate BusRoute ', chalk.green('✅'))));
  await prisma.$executeRaw`TRUNCATE TABLE \"CombinedRoute\" CASCADE;`;
  console.log(chalk.white('Completed job (4/5): ', chalk.bold('Truncate CombinedRoute ', chalk.green('✅'))));
  await prisma.$executeRaw`TRUNCATE TABLE \"Bus\" CASCADE;`;
  console.log(chalk.white('Completed job (5/5): ', chalk.bold('Truncate Bus ', chalk.green('✅'))));
  
  console.log(
    chalk.white('\nRunning', 'additional', 'jobs:\n'),
    chalk.white('\t -Reset Auto-increament sequence')
  );

  try {
    await prisma.$executeRaw`ALTER SEQUENCE \"public\".\"Session_id_seq\" RESTART WITH 1;`;
    console.log(chalk.white('Completed job : ', chalk.bold('Truncate BusRoute ', chalk.green('✅'))));
  } catch (e) {
    console.log(chalk.yellow('Warning:', chalk.white('Could not alter sequence\n')));
  }

}