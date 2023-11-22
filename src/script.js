import readlineSync from 'readline-sync';
import fs from 'node:fs';
import { exec } from 'node:child_process';
import chalk from 'chalk';

export const createEnv = () => {
  const DATABASE_URL = readlineSync.question('\nEnter DATABASE_URL: ');

  if (fs.existsSync('.env')){
    fs.rmSync('.env');  
  }

  fs.writeFileSync('.env', `DATABASE_URL="${DATABASE_URL}"\nSEED=2903`);

};

export const updateEnv = () => {
  const DATABASE_URL = readlineSync.question('\nEnter DATABASE_URL: ');

  if (fs.existsSync('.env')){
    fs.rmSync('.env');  
  }

  fs.writeFileSync('.env', `DATABASE_URL="${DATABASE_URL}"\nSEED=2903`);

  exec('npm uninstall @sih-rtt/dbclient && npm install @sih-rtt/dbclient', (error, stdout, stderr) => {
    if (error) {
      console.log(chalk.red.bold('Error:', chalk.white(`${error.message}`)));
      return;
    }

    console.log(`STDOUT: ${stdout}`);
    console.log(chalk.green('\nSuccessfully Updated .env and prisma client'));
  });
};
