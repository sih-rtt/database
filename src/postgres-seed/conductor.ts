import { PrismaClient } from '@prisma/client';
import { fakerEN_IN as faker } from '@faker-js/faker';
import _ from 'lodash';
import chalk from 'chalk';
import cliProgress from 'cli-progress';;

const prisma = new PrismaClient();
faker.seed(parseInt(process.env.SEED as string));

export type GenderType = 'female' | 'male'
const genderArray: GenderType[] = _.times(10, (i: number) => i === 9 ? 'female' : 'male');

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

export const generateConductor = () => {
  const gender: GenderType = genderArray[_.random(0, 9)];
  const firstName: string = faker.person.firstName(gender);
  const lastName: string = faker.person.lastName(gender);

  const conductorIdArray: string[] = 
  [
    _.truncate(_.toLower(firstName), { 
      length: 2,
      omission: ''
    }),

    _.truncate(_.toLower(lastName), { 
      length: 2,
      omission: ''
    }),

    '@sih.com'
  ];

  const conductorId: string = _.join(conductorIdArray, '');
  const password: string = 'sih2023@conductor';
  const phoneNumber: string = faker.phone.number();

  return {
    conductorId: conductorId,
    password: password,
    fullName: `${firstName} ${lastName}`,
    gender: gender,
    phoneNumber: phoneNumber,
  }
}

export const seedConductor = async (numRecords: number = 100) => {
  try{
    console.log('\n')
    progressBar.start(numRecords, 0);

    for (let i = 0; i < numRecords; i++) {
      await prisma.conductor.createMany({
        data: generateConductor(),
        skipDuplicates: true
      });
      progressBar.update(i);
    }

    progressBar.update(numRecords);
    progressBar.stop();

    console.log('\n', '\n', chalk.bold.green('Success:'), chalk.white.bold(`Successfully seeded "Conductor" table with ${numRecords} records!`))
    console.log('\n', chalk.yellow('Note:'), chalk.white(`The number of records can be less than ${numRecords} if duplicates are found while seeding.\n`))

  } catch (e) {
    progressBar.stop()
    console.log('\n', chalk.bold.redBright('Error:'), chalk.bold.white('Cannot seed "BusStop" table the SQL database.\n'));
    console.log(e);
    process.exit(1);

  } finally {
    prisma.$disconnect();

  }
}
