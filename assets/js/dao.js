'use strict';

const qs = require('qs');
const ROOT = 'http://cz-api.coverslide.xyz';

export const getFiles = directory => fetch(`${ROOT}/file-list?${qs.stringify({ directory })}`).then(response => response.json());
