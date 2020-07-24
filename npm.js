const shell = require('shelljs');

const { log } = console;

function init(targetPath) {
  log(`> Init npm in ${targetPath}`);
  const currPath = shell.pwd().toString();
  shell.cd(targetPath);
  shell.exec('npm init -y');
  shell.cd(currPath);
}

function install(pkgName, version) {
  log(`> Installing ${pkgName}@${version}`);
  shell.exec(`npm install v${version}@npm:${pkgName}@${version} -f`);
}

function pastVersion(pkgName, lastCount) {
  log(`> Checking last ${lastCount} versions of ${pkgName}`);
  const { stdout } = shell.exec(`npm view ${pkgName} versions --json`, { silent: true });
  const versionList = JSON.parse(stdout);
  const stableVersion = new RegExp(/^\d+.\d+.\d+$/);
  const filteredList = versionList.filter((ver) => stableVersion.test(ver));
  const result = filteredList.reverse().slice(0, lastCount);
  log(result);
  return result;
}

module.exports = {
  init,
  install,
  pastVersion
};
