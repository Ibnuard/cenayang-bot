const fs = require('fs-extra');
const path = require('path');

//path

const getPathValue = dir => {
  switch (dir) {
    case 'group_premium':
      return './database/group/premium.json'; //path.resolve(__dirname, '../database/group/premium.json');
      break;
    case 'reminder':
      return './database/reminder/list.json'; //path.resolve(__dirname, '../database/group/premium.json');
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

const saveDataOvt = async (path, value) => {
  const file = getPathValue(path);

  const _encode = JSON.stringify(value);

  fs.writeFileSync(file, _encode);
};

const updateData = (path, data, key) => {
  const file = getPathValue(path);
  const existingData = loadData(path);

  for (let i = 0; i < existingData.length; i++) {
    if (existingData[i].id == data?.id) {
      existingData[i][key] = data[key];
    }
  }

  const _encode = JSON.stringify(existingData);

  fs.writeFileSync(file, _encode);
};

const loadData = path => {
  const file = getPathValue(path);
  const data = fs.readFileSync(file);

  const parsed = JSON.parse(data);

  return parsed;
};

module.exports = {
  saveData,
  saveDataOvt,
  loadData,
  updateData,
};
