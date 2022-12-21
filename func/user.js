const {loadData, saveData, saveDataOvt} = require('./storage');

//CHECK IF USER PREMIUM
const checkIsUserPremium = async id => {
  const data = await loadData('premium');

  if (data.length) {
    const find = data.filter((item, index) => {
      return item == id;
    });

    if (find.length > 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

//add user to premium
const addUserToPremium = async id => {
  const isPremium = await checkIsUserPremium(id);

  if (isPremium) {
    return 'ALREADY_PREMIUM';
  } else {
    saveData('premium', id);
    return 'SUCCESS';
  }
};

//check user quota
const isUserQuotaAvailable = async (id, chat) => {
  const data = loadData('quota');
  const isPremium = await checkIsUserPremium(id);
  const isGroup = chat.isGroup;

  if (isGroup) {
    return true;
  }

  if (!isPremium) {
    if (data.length) {
      const find = data.filter((item, index) => {
        return item == id;
      });

      //SET QUOTA TO 10 REQUEST/DAY
      if (find.length > 10) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  } else {
    return true;
  }
};

//note user command
const addUserCommandCount = async (id, chat) => {
  const isPremium = await checkIsUserPremium(id);
  const isGroup = chat.isGroup;

  if (isGroup) {
    return 'SUCCESS';
  }

  if (!isPremium) {
    saveData('quota', id);
    return 'SUCCESS';
  }
};

//reset user quota
const resetUserQuota = () => {
  saveDataOvt('quota', []);
  console.log('USER QUOTA RESET!');
};

module.exports = {
  checkIsUserPremium,
  isUserQuotaAvailable,
  addUserToPremium,
  addUserCommandCount,
  resetUserQuota,
};
