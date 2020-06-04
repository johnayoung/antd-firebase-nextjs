const moment = require('moment');

const arrays = module.exports;
const _ = require('lodash');

arrays.arrayToObject = function (key, input) {
  return _.reduce(
    input,
    (acc, value) => {
      acc.push({ [key]: value });
      return acc;
    },
    []
  );
};

arrays.sanitizeMatrix = function (input) {
  if (_.isArray(input)) {
    // flatten deep
    return _.flattenDeep(input);
  }
  return _.flattenDeep(input.split(','));
};

arrays.asyncBatchProcess = async (array, fn, parallel, fnArgs = {}) => {
  const parallelBatches = Math.ceil(array.length / parallel);

  console.log(
    `\nI have gotten the task of ${array.length} and will take ${parallel} of them in parallel.`
  );

  console.log(` This will result in ${parallelBatches} batches.`);

  // Split up the Array
  let k = 0;
  const allValues = [];
  for (let i = 0; i < array.length; i += parallel) {
    k++;
    console.log(`\nBatch ${k} of ${parallelBatches}`);
    // Launch and Setup Chromium

    const promises = [];
    for (let j = 0; j < parallel; j++) {
      const elem = i + j;
      // only proceed if there is an element
      if (array[elem] != undefined) {
        // Promise to take Screenshots
        promises.push(fn(array[elem], fnArgs));
      }
    }

    // await promise all and close browser
    await Promise.all(promises).then(function (values) {
      console.log("\nI finished this batch. I'm ready for the next batch");
      // console.log(values);
      allValues.push(...values);
    });
  }
  return allValues;
};

arrays.batchProcess = async (array, fn, parallel) => {
  const parallelBatches = Math.ceil(array.length / parallel);

  console.log(
    `\nI have gotten the task of ${array.length} and will take ${parallel} of them in parallel.`
  );

  console.log(` This will result in ${parallelBatches} batches.`);

  // Split up the Array
  let k = 0;
  for (let i = 0; i < array.length; i += parallel) {
    k++;
    console.log(`\nBatch ${k} of ${parallelBatches}`);
    // Launch and Setup Chromium

    const functions = [];
    for (let j = 0; j < parallel; j++) {
      const elem = i + j;
      // only proceed if there is an element
      if (array[elem] != undefined) {
        // Promise to take Screenshots
        functions.push(fn);
      }
    }

    // await promise all and close browser
    functions.forEach((func) => func());

    console.log("\nI finished this batch. I'm ready for the next batch");
    const delayInMilliseconds = 1000; // 1 second

    setTimeout(function () {
      // your code to be executed after 1 second
    }, delayInMilliseconds);
  }
};

arrays.sortingComparators = (field, config = {}) => ({
  date: (a, b) => {
    if (config.dateFormat) {
      const { dateFormat } = config;
      return moment(a[field], dateFormat) - moment(b[field], dateFormat);
    }

    return moment(a[field]) - moment(b[field]);
  },
  number: (a, b) => a[field] - b[field],
  money: (a, b) => a[field] - b[field],
  digit: (a, b) => a[field] - b[field],
  index: (a, b) => a[field] - b[field],
  indexBorder: (a, b) => a[field] - b[field],
  string: (a, b) => {
    const isNonSortable = (item) => _.isNil(item) || item === '';

    if (isNonSortable(a[field]) && isNonSortable(b[field])) {
      return 0;
    }

    if (isNonSortable(a[field])) {
      return 1;
    }

    if (isNonSortable(b[field])) {
      return -1;
    }

    const x = a[field].toUpperCase();
    const y = b[field].toUpperCase();
    return x == y ? 0 : x > y ? 1 : -1;
  },
  text: (a, b) => {
    const isNonSortable = (item) => _.isNil(item) || item === '';

    if (isNonSortable(a[field]) && isNonSortable(b[field])) {
      return 0;
    }

    if (isNonSortable(a[field])) {
      return 1;
    }

    if (isNonSortable(b[field])) {
      return -1;
    }

    const x = a[field].toUpperCase();
    const y = b[field].toUpperCase();
    return x == y ? 0 : x > y ? 1 : -1;
  },
  default: (a, b) => a[field] - b[field],
});

arrays.sequenceArrayToObject = (array) =>
  array.reduce((acc, param, index) => {
    if (index % 2 === 0) {
      acc[param] = null;
      return acc;
    }
    const paramName = array[index - 1];
    acc[paramName] = param;
    return acc;
  }, {});
