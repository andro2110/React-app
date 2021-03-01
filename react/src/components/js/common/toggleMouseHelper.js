const addPointer = (t) => {
  t.target.style.cursor = "pointer";
};

const removePointer = (t) => {
  t.target.style.cursor = "";
};

module.exports = {
  addPointer,
  removePointer,
};
