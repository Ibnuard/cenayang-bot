const fs = require('fs');

//path
const premium = require('../database/group/premium.json');

const getPathValue = path => {
  switch (path) {
    case 'premium':
      return premium;
      break;

    default:
      return null;
      break;
  }
};

const saveData = async (path, value) => {
  const file = getPathValue(path);
  await fs.readFile(file, function (err, data) {
    if (!err) {
      var json = JSON.parse(data);
      json.push(value);

      fs.writeFile(file, JSON.stringify(json));
    } else {
      console.log('save db error : ' + err);
    }
  });

  return;
};

const loadData = path => {
  fs.readFile(premium, function (err, data) {
    var json = JSON.parse(data);

    return json;
  });
};

module.exports = {
  saveData,
  loadData,
};
