import chalk from 'chalk';
import { PrismaClient } from '@prisma/client';
import { PREPARE_DATA } from '../prepare';
import fs from 'node:fs';
import path from 'node:path';
import { seedBuses, truncateBus } from './bus';
import { seedBusStops, truncateBusStop } from './bus-stop';
import { seedSuggest, truncateSuggest } from './suggest';

export const seedCompleteRedis = async () => {

  await truncateRedisRepos();

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
    chalk.white('Running', chalk.bold(3), 'jobs:\n'),
    chalk.white.bold('\t1. Seed Bus\n'),
    chalk.white.bold('\t2. Seed BusStop\n'),
    chalk.white.bold('\t3. Seed Suggest\n')
  )

  await seedBuses();
  console.log(chalk.white('Completed job (1/3): ', chalk.bold('Seed Bus ', chalk.green('✅'))));

  await seedBusStops();
  console.log(chalk.white('Completed job (2/3): ', chalk.bold('Seed BusStop ', chalk.green('✅'))));

  await seedSuggest();
  console.log(chalk.white('Completed job (3/3): ', chalk.bold('Seed Suggest ', chalk.green('✅'))));
}

export const truncateRedisRepos = async () => {
  console.log(
    chalk.white('Running', chalk.bold(3), 'jobs:\n'),
    chalk.white.bold('\t1. Truncate Bus\n'),
    chalk.white.bold('\t2. Truncate BusStop\n'),
    chalk.white.bold('\t3. Truncate Suggest\n'),
  );
  await truncateBus();
  console.log(chalk.white('Completed job (1/3): ', chalk.bold('Truncate Bus ', chalk.green('✅'))));
  await truncateBusStop();
  console.log(chalk.white('Completed job (2/3): ', chalk.bold('Truncate BusStop ', chalk.green('✅'))));
  await truncateSuggest();
  console.log(chalk.white('Completed job (3/3): ', chalk.bold('Truncate Suggest ', chalk.green('✅'))));

}