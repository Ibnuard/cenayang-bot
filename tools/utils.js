function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const isUrl = url => {
  return url.match(
    new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi,
    ),
  );
};

module.exports = {
  randomInt,
  isUrl,
};
