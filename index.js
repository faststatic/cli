#!/usr/bin/env node

const shell = require("shelljs");
const fs = require("fs");
const path = require("path");
const npm = require("./npm");
const cdnjs = require("./cdnjs");

const log = console.log;
const options = process.argv.slice(2);
const operation = options[0];

function initFolder() {
  const pkgName = options[1];
  const currPath = shell.pwd().toString();
  const folderPath = path.resolve(currPath, pkgName);
  if (fs.existsSync(folderPath)) {
    fs.rmdirSync(folderPath, { recursive: true });
  }
  fs.mkdirSync(folderPath);
  npm.init(folderPath);
}

function installPkg() {
  if (options.length !== 3) {
    log("Error on arguments");
    shell.exit(1);
  }
  const pkgName = options[1];
  const lastCount = parseInt(options[2], 10);
  const currPath = shell.pwd().toString();
  const folderPath = path.resolve(currPath, pkgName);
  shell.cd(folderPath);
  const versions = npm.pastVersion(pkgName, lastCount);
  log(`> Installing package '${pkgName}' with last ${lastCount} versions...`);
  versions.forEach((version) => {
    npm.install(pkgName, version);
  });
  shell.cd(currPath);
}

function clearPkg() {
  const stableVersion = new RegExp(/^v\d+.\d+.\d+$/);
  const currPath = shell.pwd().toString();
  const pkgFolderList = fs.readdirSync(currPath);
  pkgFolderList.forEach((pkgFolder) => {
    const folderPath = path.join(currPath, pkgFolder, "node_modules");
    if (fs.existsSync(folderPath)) {
      const folderList = fs.readdirSync(folderPath);
      folderList.forEach((folder) => {
        if (!stableVersion.test(folder)) {
          const removeFolderPath = path.join(folderPath, folder);
          log(`> Removing ${removeFolderPath}`);
          fs.rmdirSync(removeFolderPath, { recursive: true });
        }
      });
    }
  });
}

switch (operation) {
  case "init": {
    initFolder();
    break;
  }
  case "install": {
    installPkg();
    break;
  }
  case "past": {
    npm.pastVersion(options[1], parseInt(options[2], 10));
    break;
  }
  case "i": {
    initFolder();
    installPkg();
    break;
  }
  case "list": {
    // eslint-disable-next-line func-names
    (async function () {
      const pkgList = await cdnjs.getPkgList();
      log(pkgList);
    })();
    break;
  }
  case "sync": {
    // eslint-disable-next-line func-names
    (async function () {
      const pkgList = await cdnjs.getPkgList();
      const lastCount = parseInt(options[1], 10);
      log(pkgList);
      pkgList.forEach((pkg) => {
        shell.exec(`faststatic i ${pkg} ${lastCount}`);
      });
    })();
    break;
  }
  case "clean":
    clearPkg();
    break;
  default:
    log("Error on arguments");
    shell.exit(-1);
    break;
}
