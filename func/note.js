const {loadData, saveData, saveDataOvt} = require('./storage');

//CREATE NOTE MODEL
const createNote = async (author, name, value) => {
  const model = {
    id: author,
    name: name,
    value: value,
  };

  const notes = loadData('notes');

  if (notes.length > 0) {
    const find = notes.filter((item, index) => {
      return item.id == author && item.name == name;
    });

    if (find.length > 0) {
      return 'DATA_EXIST';
    } else {
      saveData('notes', model);
      return 'SUCCESS';
    }
  } else {
    saveData('notes', model);
    return 'SUCCESS';
  }
};

//READ NOTES
const readNotes = async (author, name) => {
  const notes = loadData('notes');

  if (notes.length > 0) {
    const find = notes.filter((item, index) => {
      return item.id == author && item.name == name;
    });

    if (find.length > 0) {
      return find[0].value;
    } else {
      return 'NOT_EXIST';
    }
  } else {
    return 'NO_DATA';
  }
};

//READ NOTES
const deleteNotes = async (author, name) => {
  const notes = loadData('notes');

  if (notes.length > 0) {
    const find = notes.filter((item, index) => {
      return item.id == author && item.name == name;
    });

    if (find.length > 0) {
      const rm = notes.filter((item, index) => {
        return item.id !== author && item.name !== name;
      });

      saveDataOvt('notes', rm);
      return 'SUCCESS';
    } else {
      return 'NOT_EXIST';
    }
  } else {
    return 'NO_DATA';
  }
};

const noteList = async author => {
  const notes = loadData('notes');

  if (notes.length > 0) {
    const find = notes.filter((item, index) => {
      return item.id == author;
    });

    if (find.length > 0) {
      return find;
    } else {
      return 'NO_DATA';
    }
  } else {
    return 'NO_DATA';
  }
};

module.exports = {
  createNote,
  readNotes,
  deleteNotes,
  noteList,
};
