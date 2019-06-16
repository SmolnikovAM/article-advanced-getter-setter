const fs = require("fs");

const PATH_README = "./scripts/readme.md";

const dataMap = new Map();

function readFile() {
  const data = fs
    .readFileSync(PATH_README)
    .toString()
    .split("\n");
  data.forEach(line => {
    const [gistFileName, url] = line.slice(1, -1).split("](");
    if (!gistFileName || !url) return;
    dataMap.set(gistFileName, url);
  });
}

function appendInfo({ gistFileName, url }) {
  dataMap.set(gistFileName, url);
  const str = Array.from(dataMap)
    .map(([g, u]) => `[${g}](${u})`)
    .join("\n");
  fs.writeFileSync(PATH_README, str, { flag: "w" });
}

readFile();

module.exports = { appendInfo };
