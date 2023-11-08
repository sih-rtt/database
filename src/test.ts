const fs = require('fs');
import { existsSync } from 'node:fs';
const path = require('path');

// Get the current timestamp
const timestamp = new Date().toISOString().replace(/[-:]/g, '_');

// Define the directory path and filename
const directory = 'path/to/directory';
const filename = `file_${timestamp}.txt`;

const resolvedPath = path.resolve(directory, filename);
console.log(existsSync(resolvedPath), existsSync(path.resolve('src','index.ts')));
// const spinner = ora('Fetching OSM Data...');

// export const getOsmData = async () => {
//   spinner.color = 'green';
//   spinner.start();
//   try {
//     const res = await fetch(
//         'https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3Barea%28id%3A3607902476%29-%3E.a%3B%28relation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22bus%22%5D%28area.a%29%3B%3E%3Bnode%28r%29%3B%29%3Bout%3B'
//       )
//       .then(
//         (data: any) => data.json()
//       );
//     spinner.stop()
//     return res.elements?.filter((elem: any) => elem?.type === 'relation');

//   } catch(e) {
//     spinner.stop()
//     console.log(chalk.red('\nError: ', chalk.white('Could not fetch data\n')));
//     console.log(e);
//     process.exit(1);
//   }
  
// }

// const getCount = (elem: any, data: any[]) => {
//   var count = 0
//   data.forEach((el) => {
//     if (elem.tags?.ref === el.tags?.ref){
//       count++;
//     }
//   })

//   return count;
// }

// const data = await getOsmData();
// console.log(data.length)
// // console.log(getCount(data.filter((elem: any) => elem.tags?.ref && elem.tags?.ref === 'V-500D')[0], data))
// const busNumbers = data?.filter((elem: any) => elem?.tags?.ref && getCount(elem, data) === 2)
// console.log(busNumbers?.length)
// // console.log(data?.filter((elem: any) => elem?.tags?.from && elem?.tags?.to).length)
// console.log(busNumbers?.map((busNumber: any) => busNumber.tags.ref))