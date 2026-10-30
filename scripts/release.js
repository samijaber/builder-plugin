import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const BUMPS = ['patch', 'minor', 'major'];
const bump = process.argv[2] ?? 'patch';

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function read(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

function readPackage() {
  return JSON.parse(readFileSync('package.json', 'utf8'));
}

function isPublished(name, version) {
  try {
    return read(`npm view ${name}@${version} version`) === version;
  } catch {
    return false;
  }
}

function tagExists(tag) {
  return read(`git tag --list ${tag}`) === tag;
}

if (!BUMPS.includes(bump)) {
  console.error(`Unknown bump "${bump}". Use one of: ${BUMPS.join(', ')}`);
  process.exit(1);
}

if (read('git status --porcelain')) {
  console.error('Working tree is not clean. Commit or stash your changes first.');
  process.exit(1);
}

if (read('git branch --show-current') !== 'main') {
  console.error('Releases must be made from the main branch.');
  process.exit(1);
}

try {
  read('npm whoami');
} catch {
  console.error('Not logged in to npm. Run `npm login` first.');
  process.exit(1);
}

run('git pull --ff-only');
run('npm run tsc');
run('npm run build');

const { name, version } = readPackage();

if (isPublished(name, version)) {
  run(`npm version ${bump} -m "Release v%s"`);
} else {
  console.log(`\n${name}@${version} is not on npm yet, publishing it as is.`);
}

const next = readPackage().version;
run('npm publish');

if (!tagExists(`v${next}`)) run(`git tag v${next}`);
run('git push --follow-tags');

console.log(`\nReleased ${name}@${next}`);
