const loggedOutLinks = [
  {
    link: "/",
    linkName: "Domov",
  },
  {
    link: "/blog",
    linkName: "Blog",
  },
  {
    link: "/narocila",
    linkName: "Naročila",
  },
  {
    link: "/#kdoSem",
    linkName: "Kdo sem?",
  },
  {
    link: "/signUp",
    linkName: "Ustvari račun",
  },
  {
    link: "/login",
    linkName: "Prijavi se",
  },
];

const loggedInLinks = [
  {
    link: "/",
    linkName: "Domov",
  },
  {
    link: "/blog",
    linkName: "Blog",
  },
  {
    link: "/narocila",
    linkName: "Naročila",
  },
  {
    link: "/#kdoSem",
    linkName: "Kdo sem?",
  },
  {
    link: "/logout",
    linkName: "Odjava",
  },
];

const adminLinks = [
  {
    link: "/",
    linkName: "Domov",
  },
  {
    link: "/blog",
    linkName: "Blog",
  },
  {
    link: "/narocila",
    linkName: "Naročila",
  },
  {
    link: "/#kdoSem",
    linkName: "Kdo sem?",
  },
  {
    link: "/adminNarocila",
    linkName: "Prejeta naročila",
  },
  {
    link: "/logout",
    linkName: "Odjavi se",
  },
];

module.exports = {
  adminLinks,
  loggedOutLinks,
  loggedInLinks,
};
