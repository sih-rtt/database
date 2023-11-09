import fs from 'node:fs';
import path from 'node:path';
import ora from 'ora';
import chalk from 'chalk';

const spinner = ora('Fetching OSM Data...');

export const getOsmData = async () => {
  spinner.color = 'green';
  spinner.start();
  try {
    const res = await fetch(
        'https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3Barea%28id%3A3607902476%29-%3E.a%3B%28relation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22bus%22%5D%28area.a%29%3B%3E%3Bnode%28r%29%3B%29%3Bout%3B'
      )
      .then(
        (data: any) => data.json()
      );
    spinner.stop()
    return res.elements;

  } catch(e) {
    spinner.stop()
    console.log(chalk.red('\nError: ', chalk.white('Could not fetch data\n')));
    console.log(e);
    process.exit(1);
  }
  
}

const prepareData = async () => {
  const data: any[] = await getOsmData();

  if (!data) {
    console.log(chalk.red('\nError:', chalk.white('No OSM data found\n')));
    return;
  }

  console.log(chalk.bold('\nPreparing data'));

  if (!fs.existsSync(path.resolve('src', 'data')))
    fs.mkdirSync(path.resolve('src', 'data'), { recursive: true });

  const routes: any[] = data.filter((element) => element.type === 'relation' && element.members);
  const routesWithRef: any[] = routes.filter((route) => route.tags && route.tags.ref);
  fs.writeFileSync(path.resolve('src', 'data', 'routes.json'), JSON.stringify({ routesWithRef }));

  console.log('\nCompleted Routes preperation ✅');

  const aggregatedBusStopsFromRoutes = routesWithRef.map((route: any) => route.members.filter((el: any) => el.type === 'node'));

  const filteredBusStopsFromRoutes = aggregatedBusStopsFromRoutes.reduce((accumulator, currArray) => {
    currArray.forEach((busStop: any) => {
      if (!accumulator.includes(busStop.ref)) {
        accumulator.push(busStop.ref);
      }
    });
    return accumulator;
  }, [])

  const busStops = data.filter((element) => element.type === 'node' && filteredBusStopsFromRoutes.includes(element.id));
  fs.writeFileSync(path.resolve('src', 'data', 'bus-stops.json'), JSON.stringify({ busStops }));

  console.log('\nCompleted BusStop preperation ✅');

  const combinedRoutes = routesWithRef.reduce((accumulator: any, route) => {
    if (!accumulator[route.tags.ref]) {
      accumulator[route.tags.ref] = [route.id];
    } else accumulator[route.tags.ref].push(route.id);

    return accumulator
  }, {});

  fs.writeFileSync(path.resolve('src', 'data', 'combined-routes.json'), JSON.stringify({ combinedRoutes }));
  console.log('\nCompleted CombinedRoutes preperation ✅');

  const buses = [...new Set(
    routesWithRef.map((route: any) => {
      return route.tags.ref
    })
  )]

  fs.writeFileSync(path.resolve('src', 'data', 'buses.json'), JSON.stringify({ buses }));
  console.log('\nCompleted Bus preperation ✅\n');

}

export { prepareData as PREPARE_DATA };
