const axios = require('axios').default;

async function getPkgList() {
  const res = await axios.get('https://api.cdnjs.com/libraries');
  const pkgList = res.data.results.map((item) => item.name);
  return pkgList;
}

module.exports = {
  getPkgList,
};
