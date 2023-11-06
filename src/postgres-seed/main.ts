import chalk from 'chalk';
import { PrismaClient } from '@prisma/client';
import { seedBusRoutes } from './bus-routes';
import { seedBusStops } from './bus-stops';
import { seedConductor } from './conductor';

const prisma = new PrismaClient();

export const seedCompletePg = async (numRecords: number) => {
  console.log(
    chalk.white('Running', chalk.bold(3), 'jobs:\n'),
    chalk.white.bold('\t1. Seed Conductor\n'),
    chalk.white.bold('\t2. Seed BusStop\n'),
    chalk.white.bold('\t3. Seed BusRoute')
  )

  await seedConductor(numRecords);
  console.log(chalk.white('Completed job (1/3): ', chalk.bold('Seed Conductor ', chalk.green('✅'))));

  await seedBusStops();
  console.log(chalk.white('Completed job (2/3): ', chalk.bold('Seed BusStop ', chalk.green('✅'))));

  await seedBusRoutes();
  console.log(chalk.white('Completed job (3/3): ', chalk.bold('Seed BusRoute ', chalk.green('✅'))));
}

export const truncatePgTables = async () => {
  console.log(
    chalk.white('Running', chalk.bold(3), 'jobs:\n'),
    chalk.white.bold('\t1. Truncate Conductor\n'),
    chalk.white.bold('\t2. Truncate BusStop\n'),
    chalk.white.bold('\t3. Truncate BusRoute')
  );
  await prisma.$executeRaw`TRUNCATE TABLE \"Conductor\" CASCADE;`;
  console.log(chalk.white('Completed job (1/3): ', chalk.bold('Truncate Conductor ', chalk.green('✅'))));
  await prisma.$executeRaw`TRUNCATE TABLE \"BusStop\" CASCADE;`;
  console.log(chalk.white('Completed job (2/3): ', chalk.bold('Truncate BusStop ', chalk.green('✅'))));
  await prisma.$executeRaw`TRUNCATE TABLE \"Route\" CASCADE;`;
  console.log(chalk.white('Completed job (3/3): ', chalk.bold('Truncate BusRoute ', chalk.green('✅'))));
  
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