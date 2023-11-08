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

async function redisSeedHandler(this: any) {};

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
  .description(
    chalk.bold(
      'This commands helps in seeding of Redis Database.',
      chalk.bold.yellow('\rUnder Development')
    )
  )
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