const sgf = require('staged-git-files');
const fs = require('fs');

const SOLUTIONS_FOLDER = 'solutions';
const FOLDERS = [SOLUTIONS_FOLDER];
const TEST_REGEXP = /.*test\.js/;

function check(from) {
  const isGoodFolder = FOLDERS.includes(from.split('/').shift());
  const isTest = TEST_REGEXP.test(from);
  return isGoodFolder && !isTest;
}

function copyFile(from, to) {
  const newName = from.replace(/\//g, '--');
  if (!check(from)) return;
  fs.copyFileSync(`./${from}`, `../gist/${newName}`);
}

sgf((err, results) => {
  results.forEach(({filename, status}) => {
    if (!['Added', 'Modified', 'Renamed', 'Deleted'].includes(status)) return;
    if (['Added', 'Modified'].includes(status)) {
      copyFile(filename);
    }
  });
});
