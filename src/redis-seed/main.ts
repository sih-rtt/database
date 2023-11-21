import chalk from 'chalk';
import { PREPARE_DATA } from '../prepare/index.js';
import fs from 'node:fs';
import path from 'node:path';
import { seedBuses, truncateBus } from './bus.js';
import { seedBusStops, truncateBusStop } from './bus-stop.js';
import { seedSuggest, truncateSuggest } from './suggest.js';
import { createTestStream, truncateTestStream } from './locations-stream.js';

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
    chalk.white('Running', chalk.bold(4), 'jobs:\n'),
    chalk.white.bold('\t1. Seed Bus\n'),
    chalk.white.bold('\t2. Seed BusStop\n'),
    chalk.white.bold('\t3. Seed Suggest\n'),
    chalk.white.bold('\t4. Seed Test Stream\n')
  )

  await seedBuses();
  console.log(chalk.white('Completed job (1/4): ', chalk.bold('Seed Bus ', chalk.green('✅'))));

  await seedBusStops();
  console.log(chalk.white('Completed job (2/4): ', chalk.bold('Seed BusStop ', chalk.green('✅'))));

  await seedSuggest();
  console.log(chalk.white('Completed job (3/4): ', chalk.bold('Seed Suggest ', chalk.green('✅'))));

  await createTestStream()
  console.log(chalk.white('Completed job (4/4): ', chalk.bold('Seed Test Stream ', chalk.green('✅'))));
}

export const truncateRedisRepos = async () => {
  console.log(
    chalk.white('Running', chalk.bold(4), 'jobs:\n'),
    chalk.white.bold('\t1. Truncate Bus\n'),
    chalk.white.bold('\t2. Truncate BusStop\n'),
    chalk.white.bold('\t3. Truncate Suggest\n'),
    chalk.white.bold('\n4. Truncate Test Stream\n')
  );
  await truncateBus();
  console.log(chalk.white('Completed job (1/4): ', chalk.bold('Truncate Bus ', chalk.green('✅'))));
  await truncateBusStop();
  console.log(chalk.white('Completed job (2/4): ', chalk.bold('Truncate BusStop ', chalk.green('✅'))));
  await truncateSuggest();
  console.log(chalk.white('Completed job (3/4): ', chalk.bold('Truncate Suggest ', chalk.green('✅'))));
  await truncateTestStream();
  console.log(chalk.white('Completed job (4/4): ', chalk.bold('Truncate Test Stream ', chalk.green('✅'))));

}
