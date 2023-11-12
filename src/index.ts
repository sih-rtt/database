import {
  SEED_POSTGRES,
  TRUNCATE_POSTGRES
} from './postgres-seed';
import {
  SEED_REDIS,
  TRUNCATE_REDIS
} from './redis-seed';
import { Command } from 'commander';
import chalk from 'chalk';
import _ from 'lodash';
import redis from './redis-seed/redis';
import { PREPARE_DATA } from './prepare';

const program = new Command();

program
  .name('seed')
  .description(chalk.bold('Internal CLI tool to seed dev database.'))
  .version('0.0.1');

program.command('pg')
  .description(chalk.bold('This commands helps in seeding of PostgreSQL Database.'))
  .option('-n, --num <int>', 'Number of records to be seeded. (Works only for "Conductor" table)', '100')
  .action(async function (this: any) {
    const option = this.opts();
    await SEED_POSTGRES(option.num as number);
  });

program.command('redis')
  .description(chalk.bold('This commands helps in seeding of Redis Database.',))
  .action(async function (this: any) {
    await SEED_REDIS();
    redis.quit();
  })

program.command('truncate')
  .description(chalk.bold('This commands truncates the PostgreSQL Database.'))
  .argument('<database>', 'Database to be truncated')
  .action(async (database) => {
    const dbArg: string = _.toLower(database)
    if (dbArg === 'pg' || dbArg === 'postgresql' || dbArg === 'postgres') 
      await TRUNCATE_POSTGRES();
    else if (dbArg === 'redis') {
      await TRUNCATE_REDIS();
      redis.quit();
    }
    else
      console.log(chalk.red(`Unknown Argument '${dbArg}'`));
  })

program.command('prepare')
  .description(chalk.bold('This commands prepares the data for seeding and stores the prepared json files in src/data/.',))
  .action(async function (this: any) {
    await PREPARE_DATA(true);
  })

await program.parseAsync()