/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const axios = require('axios');
const fsPkg = require('./faststatic');

const pkgList = [...fsPkg.popularJS];
const finalPkgList = [];
(async () => {
  for (const pkg of pkgList) {
    try {
      const res = await axios.get(
        `https://api.npmjs.org/downloads/point/last-month/${pkg}`,
        { validateStatus: false }
      );
      let dlCount = -1;
      if ('downloads' in res.data) {
        dlCount = parseInt(res.data.downloads, 10);
      }
      console.log(pkg, dlCount);
      if (dlCount > 10000) {
        finalPkgList.push(pkg);
      }
    } catch (e) {
      console.log('pkg', e);
    }
  }
  console.log(finalPkgList.length);
  console.log(finalPkgList, { maxArrayLength: null });
})();
