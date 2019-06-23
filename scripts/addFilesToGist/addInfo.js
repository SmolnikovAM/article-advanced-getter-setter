// const fs = require("fs");

// const PATH_README = "./scripts/readme.md";

const { getGistByIdAPI, updateGistAPI } = require("./apiGist");

const FILE_NAME = "advanced-getter-setter-links.md";
const GIST_ID = "2380d5c29e871f639a0241b30db2d171";
const DESCRIPTION = "Links to pages for article Advanced Getter-Setter";
let dataLoaded = false;

const dataMap = new Map();

// function readFile() {
//   const data = fs
//     .readFileSync(PATH_README)
//     .toString()
//     .split("\n");
//   data;

//   fs.writeFileSync(PATH_README, str, { flag: "w" });
// }

async function loadData() {
  const gist = await getGistByIdAPI(GIST_ID);
  const data = gist.files[FILE_NAME].content;
  data
    .replace(/\*\s/g, "")
    .split("\n")
    .forEach(line => {
      const [gistFileName, url] = line.slice(1, -1).split("](");
      if (!gistFileName || !url) return;
      dataMap.set(gistFileName, url);
    });
}

async function appendInfo({ gistFileName, url }) {
  if (!dataLoaded) {
    await loadData();
    dataLoaded = true;
  }
  dataMap.set(gistFileName, url);
}

async function commitInfo() {
  if (!dataLoaded) {
    await loadData();
    dataLoaded = true;
  }
  const content = Array.from(dataMap)
    .map(([fileName, url]) => `* [${fileName}](${url})`)
    .join("\n");

  const data = {
    description: DESCRIPTION,
    files: { [FILE_NAME]: { content } }
  };

  await updateGistAPI(GIST_ID, data);
}

module.exports = { appendInfo, commitInfo };
