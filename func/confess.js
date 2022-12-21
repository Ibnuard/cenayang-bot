const {saveData, loadData, saveDataOvt} = require('./storage');

const createConfessRoom = async (message, value) => {
  const splitter = value.split(' ');
  const receiver = splitter[0].replace('to', '');
  const text = value.replace(splitter[0], '').trimStart();

  const getCountryCode = receiver.slice(0, 3);

  if (getCountryCode !== '628') {
    return 'NUMBER_ERROR';
  }

  if (!text.length) {
    return 'NO_MESSAGE';
  }

  const confessList = loadData('confess');

  if (confessList.length) {
    const find = confessList.filter((item, index) => {
      return item.from == message.from && item.receiver == `${receiver}@c.us`;
    });

    if (find.length) {
      return 'DATA_EXIST';
    }
  }

  const data = {
    from: message.from,
    receiver: receiver + '@c.us',
    to: 'to' + receiver,
    text: text,
  };

  saveData('confess', data);
  return 'SUCCESS';
};

const isTargetConfess = async message => {
  const text = message.body;
  const from = message.from;

  const data = loadData('confess');

  if (data.length) {
    const find = data.filter((item, index) => {
      return item.receiver == from;
    });

    if (find.length) {
      for (let list of find) {
        deleteConfess(list.from, from);
      }
      return {
        replyTo: find,
        text: text,
      };
    }
  }
};

const deleteConfess = async (author, receiver) => {
  const data = loadData('confess');

  if (data.length) {
    const find = data.filter((item, index) => {
      return item.from == author && item.receiver == receiver;
    });

    if (find.length) {
      const rm = data.filter((item, index) => {
        return item.from !== author && item.receiver !== receiver;
      });

      saveDataOvt(rm);
      return 'SUCCESS';
    } else {
      return 'NO_DATA';
    }
  } else {
    return 'NO_DATA';
  }
};

const confessList = async author => {
  const data = loadData('confess');

  if (data.length) {
    const find = data.filter((item, index) => {
      return item.from == author;
    });

    if (find.length) {
      const prefix = 'Daftar Target Confess!\n\n';
      const endfix =
        '\nBot akan mengirimkan pesan ke kamu kalo target telah mengirim balasan.';
      const text = '';

      for (let list of find) {
        text += `-> ${list.to}\n`;
      }

      return prefix + text + endfix;
    } else {
      return 'NO_DATA';
    }
  } else {
    return 'NO_DATA';
  }
};

module.exports = {
  createConfessRoom,
  isTargetConfess,
  deleteConfess,
  confessList,
};
