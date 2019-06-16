const https = require("https");
const { token, login } = require("../../token.js");

const pathToGetPublicGists = `/users/${login}/gists`;
const pathToCrateGist = "/gists";
const pathToUpdateGist = gistId => `/gists/${gistId}`;

function getStandartOptions() {
  return {
    hostname: "api.github.com",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Accept: "application/vnd.github+json",
      Authorization: `token ${token}`,
      "X-OAuth-Scopes": "gist",
      "User-Agent": ``
    }
  };
}

function githubRequest(options, sData) {
  let ok;
  let err;
  let data = "";
  const promise = new Promise((res, rej) => {
    ok = res;
    err = rej;
  });

  const req = https.request(options, res => {
    res.on("data", d => {
      data += d;
    });
    res.on("end", () => ok(data));
  });

  req.on("error", err);

  if (sData) {
    const s = typeof sData === "string" ? sData : JSON.stringify(sData);
    req.write(s);
  }

  req.end();

  return promise;
}

function getAllGistsAPI() {
  const options = getStandartOptions();
  const path = pathToGetPublicGists;
  const method = "GET";
  Object.assign(options, { path, method });
  return githubRequest(options).then(res => JSON.parse(res));
}

function createGistAPI(data) {
  const options = getStandartOptions();
  const path = pathToCrateGist;
  const method = "POST";
  Object.assign(options, { path, method });
  return githubRequest(options, data);
}

function updateGistAPI(gistId, data) {
  const options = getStandartOptions();
  const path = pathToUpdateGist(gistId);
  const method = "POST";
  Object.assign(options, { path, method });
  return githubRequest(options, data);
}

module.exports = { updateGistAPI, getAllGistsAPI, createGistAPI };
