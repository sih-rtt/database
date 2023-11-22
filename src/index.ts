#! /usr/bin/env node

import {
  SEED_POSTGRES,
  TRUNCATE_POSTGRES
} from './postgres-seed/index.js';
import {
  SEED_REDIS,
  TRUNCATE_REDIS
} from './redis-seed/index.js';
import { Command } from 'commander';
import { redis } from './redis-seed/index.js';
import { PREPARE_DATA } from './prepare/index.js';
import chalk from 'chalk';
import _ from 'lodash';
import { updateEnv } from './script.js';
import fs from 'fs';

const program = new Command();

program
  .name('dbtool')
  .description(chalk.bold('Internal CLI tool to manage dev database.'))
  .version('0.1.0');

program.command('set')
  .description(chalk.bold('This commands sets ot updates Database url.'))
  .action(() => {
    updateEnv();
    redis.quit();
  });

program.command('seed')
  .description(chalk.bold('This commands helps in seeding of Database.'))
  .argument('<database>', 'Database to be seeded')
  .action(async (database) => {
    if(!fs.existsSync('.env'))
      await updateEnv();
    const dbArg: string = _.toLower(database)
    if (dbArg === 'pg' || dbArg === 'postgresql' || dbArg === 'postgres') {
      await SEED_POSTGRES();
    }
    else if (dbArg === 'redis') {
      await SEED_REDIS();
    }
    else if (dbArg === 'all') {
      await SEED_POSTGRES();
      await SEED_REDIS();
    }
    else
      console.log(chalk.red(`Unknown Argument '${dbArg}'`));
    redis.quit();
  });

program.command('truncate')
  .description(chalk.bold('This commands truncates the Database.'))
  .argument('<database>', 'Database to be truncated')
  .action(async (database) => {
    if (!fs.existsSync('.env'))
      await updateEnv();
    const dbArg: string = _.toLower(database)
    if (dbArg === 'pg' || dbArg === 'postgresql' || dbArg === 'postgres') {
      await TRUNCATE_POSTGRES();
    }
    else if (dbArg === 'redis') {
      await TRUNCATE_REDIS();
    }
    else if (dbArg === 'all') {
      await TRUNCATE_POSTGRES();
      await TRUNCATE_REDIS();
    }
    else
      console.log(chalk.red(`Unknown Argument '${dbArg}'`));

    redis.quit();
  })

program.command('prepare')
  .description(chalk.bold('This commands prepares the data for seeding and stores the prepared json files in src/data/.',))
  .action(async function (this: any) {
    await PREPARE_DATA(true);
    redis.quit();
  })

await program.parseAsync()