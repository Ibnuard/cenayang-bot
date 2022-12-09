const fs = require('fs-extra');
const path = require('path');

//path

const getPathValue = dir => {
  switch (dir) {
    case 'group_premium':
      return './database/group/premium.json'; //path.resolve(__dirname, '../database/group/premium.json');
      break;

    default:
      return null;
      break;
  }
};

const saveData = async (path, value) => {
  const file = getPathValue(path);
  const existingData = loadData(path);

  existingData.push(value);

  const _encode = JSON.stringify(existingData);

  fs.writeFileSync(file, _encode);
};

const loadData = path => {
  const file = getPathValue(path);
  const data = fs.readFileSync(file);

  const parsed = JSON.parse(data);

  console.log('data : ' + parsed);

  return parsed;
};

module.exports = {
  saveData,
  loadData,
};
