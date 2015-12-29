'use strict';

export default (value) => (target, key, descriptor) => {
  console.log(value, target, key, descriptor);
};
