const calculator = input => {
  try {
    const hasil = eval('(' + input + ')');
    return hasil;
  } catch (error) {
    return 'NOT_VALID';
  }
};

module.exports = {
  calculator,
};
