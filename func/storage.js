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
    case 'antikasar':
      return './database/group/antikasar.json'; //path.resolve(__dirname, '../database/group/premium.json');
      break;
    case 'premium':
      return './database/user/premium.json'; //path.resolve(__dirname, '../database/group/premium.json');
      break;
    case 'quota':
      return './database/user/quota.json'; //path.resolve(__dirname, '../database/group/premium.json');
      break;
    case 'notes':
      return './database/user/notes.json'; //path.resolve(__dirname, '../database/group/premium.json');
      break;
    case 'confess':
      return './database/user/confess.json'; //path.resolve(__dirname, '../database/group/premium.json');
      break;
    case 'crypto':
      return './database/reminder/crypto.json'; //path.resolve(__dirname, '../database/group/premium.json');
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
