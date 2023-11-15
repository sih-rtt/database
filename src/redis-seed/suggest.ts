import { Entity, EntityId } from 'redis-om';
import redis, { busRepo, busStopRepo, suggestRepo } from './redis';
import chalk from 'chalk';
const cliProgress = require('cli-progress');

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);


export const seedSuggest = async () => {
  try{
    console.log('\n');

    const buses: any[] = await busRepo.search().return.all();
    const busStops: any[] = await busStopRepo.search().return.all();
    progressBar.start(buses.length + busStops.length, 0);

    for (let i = 0; i < buses.length; i++) {
      const bus = {
        suggestTerm: buses[i].busNo,
        type: 'bus',
        refId: buses[i].id
      }

      await suggestRepo.save(bus);
      progressBar.update(i);
    }

    for (let i = 0; i < busStops.length; i++) {
      const bus = {
        suggestTerm: busStops[i].name,
        type: 'bus_stop',
        refId: busStops[i].id
      }

      await suggestRepo.save(bus);
      progressBar.update(i + buses.length);
    }

    progressBar.update(buses.length + busStops.length);
    progressBar.stop();
    console.log('\n', '\n', chalk.bold.green('Success:'), chalk.white.bold(`Successfully seeded "Suggest" Repository with Postgres data!\n`))

  } catch (e) {
    progressBar.stop();
    console.log(chalk.bold.redBright('\nError:'), chalk.bold.white('Cannot seed the "Suggest" Repository of Redis database.\n'));
    console.log(e);
    process.exit(1);

  }
}

export const truncateSuggest = async () => {
  try {
    const suggestEntities: Entity[] = await suggestRepo.search().return.all();
    if (!suggestEntities.length)
      return;
    for( let i = 0; i < suggestEntities.length; i++) {
      const bus: string = suggestEntities[i][EntityId] as string
      await suggestRepo.remove(bus);
    }
    suggestRepo.dropIndex();

  } catch(e) {
    console.log(e)
    console.log(chalk.red.bold('Error:', chalk.white('Could not truncate Redis Bus repo.\n')));
  }
}
