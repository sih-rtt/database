import { Command } from 'commander';
import {
  SEED_POSTGRE_CONDUCTOR,
  SEED_POSTGRE_BUSSTOP,
  SEED_POSTGRE_BUSROUTE,
  SEED_POSTGRES,
  TRUNCATE_POSTGRES
} from './postgres-seed';
import chalk from 'chalk';
import _ from 'lodash';

const program = new Command();

async function pgSeedHandler(this: any) {
    const option = this.opts();

    if (!option.table) {
      await SEED_POSTGRES(option.num as number);
      return;
    }

    if (option.table === 'Conductor') {
      await SEED_POSTGRE_CONDUCTOR(option.num as number);

    } else if (option.table === 'BusStop') {
      await SEED_POSTGRE_BUSSTOP();

    } else if (option.table === 'BusRoute') {
      await SEED_POSTGRE_BUSROUTE();

    }
  };

async function redisSeedHandler(this: any) {};

program
  .name('seed')
  .description(chalk.bold('Internal CLI tool to seed dev database.'))
  .version('0.0.1');

program.command('pg')
  .description(chalk.bold('This commands helps in seeding of PostgreSQL Database.'))
  .option('-n, --num <int>', 'Number of records to be seeded. (Works only for "Conductor" table)', '100')
  .option('-t, --table <char>', 'Table to be seeded (Optional)', undefined)
  .action(pgSeedHandler)

program.command('redis')
  .description(
    chalk.bold(
      'This commands helps in seeding of Redis Database.',
      chalk.bold.yellow('\rUnder Development')
    )
  )
  .option('-n, --num <int>', 'Number of records to be seeded.', '100')
  .option('-r, --repo <char>', 'Redis Repository to be seeded (Optional).', undefined)
  .action(redisSeedHandler)

program.command('truncate')
  .description(chalk.bold('This commands helps in seeding of PostgreSQL Database.'))
  .argument('<database>', 'Database to be truncated')
  .action(async (database) => {
    const dbArg: string = _.toLower(database)
    if (dbArg === 'pg' || dbArg === 'postgresql' || dbArg === 'postgres')
      await TRUNCATE_POSTGRES();
  })

await program.parseAsync()