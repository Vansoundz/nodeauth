const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies._at;

  if (token) {
    jwt.verify(token, "smart people read the star", (err, t) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies._at;

  if (token) {
    jwt.verify(token, "smart people read the star", async (err, t) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(t.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
