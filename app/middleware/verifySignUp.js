const db = require("../models");
const TYPES = db.type;
const User = db.user;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Username
    let user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (user) {
      return res.status(400).send({
        message: "Failed! Username is already in use!",
      });
    }
    // Email
    user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (user) {
      return res.status(409).send({
        message: "Failed! Email is already in use!",
      });
    }
    next();
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Username!",
      error: `error: ${error}`,
      req: `req: ${req.body}`,
    });
  }
};

checkTypeExisted = (req, res, next) => {
  if (req.body.type) {
    if (!TYPES.includes(req.body.type)) {
      res.status(400).send({
        message: "Failed! type does not exist = " + req.body.type,
      });
      return;
    }
  }
  next();
};
const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkTypeExisted,
};
module.exports = verifySignUp;
