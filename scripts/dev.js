const { spawn } = require('child_process');
const path = require('path');

const rawArgs = process.argv.slice(2);
const cleanArgs = [];
let port = '3000';
let host = '0.0.0.0';

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (arg === '--host' || arg === '-H' || arg === '--hostname') {
    if (rawArgs[i + 1] && !rawArgs[i + 1].startsWith('-')) {
      host = rawArgs[i + 1];
      i++;
    }
  } else if (arg.startsWith('--host=')) {
    host = arg.split('=')[1];
  } else if (arg.startsWith('--hostname=')) {
    host = arg.split('=')[1];
  } else if (arg === '-p' || arg === '--port') {
    if (rawArgs[i + 1] && !rawArgs[i + 1].startsWith('-')) {
      port = rawArgs[i + 1];
      i++;
    }
  } else if (arg.startsWith('--port=')) {
    port = arg.split('=')[1];
  } else if (arg === '--') {
    continue;
  } else {
    cleanArgs.push(arg);
  }
}

let nextBin;
try {
  nextBin = require.resolve('next/dist/bin/next');
} catch (e) {
  nextBin = path.join(__dirname, '../node_modules/.bin/next');
}

const finalArgs = ['dev', '-p', port, '-H', host, ...cleanArgs];
const child = spawn(process.execPath, [nextBin, ...finalArgs], { stdio: 'inherit' });

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
