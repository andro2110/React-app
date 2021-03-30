function redirectU() {
  if (localStorage.getItem("token")) window.location = "/profile";
}

module.exports = {
  redirectU,
};
