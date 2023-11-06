import chalk from 'chalk';
import { seedBusRoutes } from './bus-routes';
import { seedBusStops } from './bus-stops';
import { seedConductor } from './conductor';

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