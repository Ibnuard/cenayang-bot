const moment = require('moment');
const {utils} = require('../tools');
const {getMomentDiff} = require('../tools/moment');
const {loadData, updateData, saveData, saveDataOvt} = require('./storage');

//HANDLE REMINDER COMMAND
const handleReminder = (client, message, value) => {
  const pattern = /(?<=\[)(.*?)(?=\])/;
  const format = value.match(pattern);

  //IF FORMAT VALID
  if (format) {
    const getType = format[0];
    const remind = value.split(`[${getType}]`)[1].trimStart();

    const splitted = getType.split('/');

    const randId = `R${utils.randomInt(10, 99)}`;

    if (splitted.length > 1) {
      //HARI INI WITH DETAIL
      if (splitted[0] == 'hariini') {
        const due = moment(`${splitted[1]}:${splitted[2]}`, 'HH:mm').format();

        const data = {
          listId: randId,
          id: message.from,
          datetime: due,
          message: remind,
        };

        if (due == 'Invalid date') {
          return 'ERROR_DATE';
        } else {
          saveData('reminder', data);
          return data;
        }
      }
      //RELATIVE TIME WITH DETAIL
      else if (splitted[0] == 'besok') {
        const due = moment(`${splitted[1]}:${splitted[2]}`, 'HH:mm')
          .add(1, 'days')
          .format();

        const data = {
          listId: randId,
          id: message.from,
          datetime: due,
          message: remind,
        };

        if (due == 'Invalid date') {
          return 'ERROR_DATE';
        } else {
          saveData('reminder', data);
          return data;
        }
      }
      //RELATIVE TIME WITH DETAIL
      else if (splitted[0] == 'lusa') {
        const due = moment(`${splitted[1]}:${splitted[2]}`, 'HH:mm')
          .add(2, 'days')
          .format();

        const data = {
          listId: randId,
          id: message.from,
          datetime: due,
          message: remind,
        };

        if (due == 'Invalid date') {
          return 'ERROR_DATE';
        } else {
          saveData('reminder', data);
          return data;
        }
      }
      //DETAIL TIME
      else {
        const getTime = getType.split('/');
        const due = moment(
          `'${getTime[0]} ${getTime[1]} ${getTime[2]} ${getTime[3]}:${getTime[4]}'`,
          'Do MM YYYY HH:mm',
        ).format();

        const data = {
          listId: randId,
          id: message.from,
          datetime: due,
          message: remind,
        };

        if (due == 'Invalid date') {
          return 'ERROR_DATE';
        } else {
          saveData('reminder', data);
          return data;
        }
      }
    } else {
      //relative time
      if (getType == 'besok') {
        const due = moment().add(1, 'days');
        const data = {
          listId: randId,
          id: message.from,
          datetime: due,
          message: remind,
        };

        if (due == 'Invalid date') {
          return 'ERROR_DATE';
        } else {
          saveData('reminder', data);
          return data;
        }
      }
      //LUSA DAY + 2
      else if (getType == 'lusa') {
        const due = moment().add(2, 'days');
        const data = {
          listId: randId,
          id: message.from,
          datetime: due,
          message: remind,
        };

        if (due == 'Invalid date') {
          return 'ERROR_DATE';
        } else {
          saveData('reminder', data);
          return data;
        }
      }
    }

    //do date

    //BESOK DAY + 1
    // if (getType == 'besok') {
    //   const due = moment().add(1, 'days');
    //   const data = {
    //     id: message.from,
    //     datetime: due,
    //     message: remind,
    //   };

    //   saveData('reminder', data);
    //   return data;
    // }
    // //LUSA DAY + 2
    // else if (getType == 'lusa') {
    //   const due = moment().add(2, 'days');
    //   const data = {
    //     id: message.from,
    //     datetime: due,
    //     message: remind,
    //   };

    //   saveData('reminder', data);
    //   return data;
    // }
    // //TODAY AND CUSTOM DATE
    // else {
    //   const splitted = getType.split('/');

    //   if (splitted[0] == 'hariini') {
    //     const due = moment(`${splitted[1]}:${splitted[2]}`, 'HH:mm').format();

    //     const data = {
    //       id: message.from,
    //       datetime: due,
    //       message: remind,
    //     };

    //     saveData('reminder', data);
    //     return data;
    //   } else {
    //     const getTime = getType.split('/');
    //     const due = moment(
    //       `'${getTime[0]} ${getTime[1]} ${getTime[2]} ${getTime[3]}:${getTime[0]}'`,
    //       'Do MM YYYY HH:mm',
    //     ).format();

    //     const data = {
    //       id: message.from,
    //       datetime: due,
    //       message: remind,
    //     };

    //     saveData('reminder', data);
    //     return data;
    //   }
    // }
  } else {
    console.log('format receivd : ' + JSON.stringify(format));
    return 'FORMAT_FAILED';
  }
};

//GET REMINDER LIST
const reminderList = id => {
  const existingData = loadData('reminder');

  if (existingData.length > 0) {
    const datas = existingData.filter((item, index) => {
      return item.id == id;
    });

    let temp = '';
    const prefix = 'Daftar pengingat yang dibuat : \n\n';
    const endl =
      '\n\nNote : Untuk menghapus pengingat kalian bisa gunakan perintah _!ingetin hapus ID_ . ID bisa dilihat di list pengingat yang diawali dengan huruf R contoh R12. format ID adalah RXX.';

    //NO REMINDER ON THIS CHAT
    if (datas.length > 0) {
      for (let index = 0; index < datas.length; index++) {
        const str = `${datas[index].listId} || ${moment(
          datas[index].datetime,
        ).format('lll')} || ${datas[index].message}`;
        temp = temp + str + '\n';
      }

      return prefix + temp + endl;
    } else {
      return 'NO_DATA';
    }
  } else {
    // NO REMINDER DATA
    return 'NO_DATA';
  }
};

//DELET REMINDER BY ID
const deleteReminder = (reminderId, id) => {
  function removeObjectWithId(arr, id) {
    const objWithIdIndex = arr.findIndex(obj => obj.listId === id);

    if (objWithIdIndex > -1) {
      arr.splice(objWithIdIndex, 1);
    }

    return arr;
  }

  const listReminder = loadData('reminder');

  if (listReminder.length > 0) {
    const find = listReminder.filter((item, index) => {
      return item.listId == id;
    });

    if (find.length) {
      const result = removeObjectWithId(listReminder, id);

      saveDataOvt('reminder', result);
      return 'SUCCESS';
    } else {
      return 'NO_DATA';
    }
  } else {
    return 'NO_DATA';
  }
};

//CHEK REMINDER TIME
const checkReminderTime = async client => {
  const data = loadData('reminder');

  if (data.length) {
    console.log('REMINDER FOUND : ' + data?.length);

    data.forEach(async (item, index) => {
      const valid = getMomentDiff(item.datetime, 'minute');

      const roundTime = Math.round(valid);

      console.log('RUNNING FOR : ' + roundTime);

      if (roundTime > -1) {
        console.log('REMINDER START : ' + item.message);

        await client.sendMessage(item.id, `Cenayang BOT Reminder`);
        await client.sendMessage(item.id, `-> _${item.message}_`);
        client.sendMessage(item.id, 'Have nice yayyy!!!');
      }

      if (valid == 1) {
        deleteReminder(item.id, item.listId);
      }
    });
  } else {
    console.log('REMINDER NOT FOUND');
  }
};

//EXPORT MODULES
module.exports = {
  handleReminder,
  reminderList,
  deleteReminder,
  checkReminderTime,
};
