const fs = require("fs");
const path = require("path");

const { getAllGistsAPI, createGistAPI, updateGistAPI } = require("./apiGist");
const { getModifiedStagedFilesFromGit } = require("./apiStaged");
const { appendInfo } = require("./addInfo");

const SOLUTIONS_FOLDER = "solutions";
const FOLDERS = [SOLUTIONS_FOLDER];
const ARTICLE_NAME = "advanced-getter-setter";
const JS_REGEXP = /\.js$/;
const description = "article advanced getter/setter";

function check(from) {
  const isGoodFolder = FOLDERS.includes(from.split(path.sep).shift());
  const isJS = JS_REGEXP.test(from);
  return isGoodFolder && isJS;
}

function createGist({ filename, gistFileName }) {
  const content = fs.readFileSync(filename).toString();
  const data = {
    description,
    public: true,
    files: { [gistFileName]: { content } }
  };
  return createGistAPI(data);
}

function updateGist({ gist, filename, gistFileName }) {
  const { id } = gist;
  const content = fs.readFileSync(filename).toString();

  const data = {
    description,
    files: { [gistFileName]: { content } }
  };

  return updateGistAPI(id, data);
}

function gistNameFromPath(filename) {
  const newPath = filename.split(path.sep);
  if (newPath.length) newPath.shift();
  return `${ARTICLE_NAME}--${newPath.join("--")}`;
}

async function updateGists(staged, allGists) {
  const gistByFile = new Map();
  allGists.forEach(gist => {
    Reflect.ownKeys(gist.files).forEach(name => {
      gistByFile.set(name, gist);
    });
  });

  const files = staged.map(filename => ({
    filename,
    gistFileName: gistNameFromPath(filename)
  }));

  for ({ filename, gistFileName } of files) {
    const gist = gistByFile.get(gistFileName);
    if (gist) {
      await updateGist({ gist, filename, gistFileName });
    } else {
      const data = await createGist({ filename, gistFileName });
      const jsonData = JSON.parse(data);
      const { url } = jsonData;
      if (url) appendInfo({ url, gistFileName });
    }
  }
}

async function run() {
  try {
    require("../../token");
  } catch (e) {
    console.log("info: no token for gist creation");
    return;
  }
  const staged = await getModifiedStagedFilesFromGit();
  const allGists = await getAllGistsAPI();
  const filteredStaged = staged.filter(filename => check(filename));
  if (filteredStaged.length === 0) return;
  await updateGists(filteredStaged, allGists);
}

run();
