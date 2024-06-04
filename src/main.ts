import { Application } from './app/Application';

async function main(): Promise<void> {
  await Application.init();
}

void main();
