const sgf = require("staged-git-files");
const { promisify } = require("util");

const sgfPromise = promisify(sgf);

function getModifiedStagedFilesFromGit() {
  return sgfPromise().then(res =>
    res.reduce((acc, { filename, status }) => {
      if (["Modified", "Added" /* "Renamed" */].includes(status)) {
        acc.push(filename);
      }
      return acc;
    }, [])
  );
}

module.exports = { getModifiedStagedFilesFromGit };
