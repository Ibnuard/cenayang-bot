const moment = require('moment');
const {loadData, updateData, saveData} = require('./storage');

const handleReminder = (client, message, value) => {
  const pattern = /(?<=\[)(.*?)(?=\])/;
  const format = value.match(pattern);

  function saveData(data) {
    return saveReminderData(data, message);
  }

  if (format) {
    const getType = format[0];
    const remind = value.split(`[${getType}]`)[1].trimStart();

    //do date
    if (getType == 'besok') {
      const due = moment().add(1, 'days');
      const data = {
        datetime: due,
        message: remind,
      };

      return saveData(data);
    } else if (getType == 'lusa') {
      const due = moment().add(2, 'days');
      const data = {
        datetime: due,
        message: remind,
      };
      return saveData(data);
    } else if (getType == 'hariini') {
      const getTime = getType.split('/');
      const due = moment(`${getTime[1]}:${getTime[2]}`, 'HH:mm').format();

      console.log(due);

      const data = {
        datetime: due,
        message: remind,
      };
      return due !== 'Invalid date' ? saveData(data) : null;
    } else {
      const getTime = getType.split('/');
      const due = moment(
        `'${getTime[0]} ${getTime[1]} ${getTime[2]} ${getTime[3]}:${getTime[0]}'`,
        'Do MM YYYY HH:mm',
      ).format();

      const data = {
        datetime: due,
        message: remind,
      };

      return saveData(data);
    }
  } else {
    return 'FORMAT_FAILED';
  }
};

const reminderList = id => {
  const existingData = loadData('reminder');

  if (existingData.length > 0) {
    const datas = existingData.filter((item, index) => {
      return item.id == id;
    });

    let temp = '';
    const prefix = 'Daftar pengingat yang dibuat : \n\n';
    const endl =
      '\n\nNote : Untuk saat ini daftar pengingat yang dibuat tidak bisa di hapus yaww...';

    for (let index = 0; index < datas.length; index++) {
      const str = `$${moment(datas[index].datetime)} || ${
        datas[index].message
      }`;
      temp = temp + str + '\n';
    }

    return prefix + temp + endl;
  } else {
    return 'NO_DATA';
  }
};

const saveReminderData = (data, message) => {
  //{id, list}
  const listData = {id: message?.from, ...data};
  saveData('reminder', listData);

  return {time: data?.time};
};

module.exports = {
  handleReminder,
  reminderList,
};
