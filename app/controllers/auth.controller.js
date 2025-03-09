const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { executeTypeHandler } = require("../utils/typeHandlers.utils");

exports.signup = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const user = await User.create(
      {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        type: req.body.type,
      },
      { transaction }
    );

    const profile = await executeTypeHandler(user, req, transaction);
    await transaction.commit();
    res.send({ message: "User registered successfully!", user, profile });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }
    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      config.secret,
      { expiresIn: 86400 } // 24 hours
    );
    return res.status(200).send({
      userId: user.userId,
      username: user.username,
      email: user.email,
      type: user.type,
      token: token,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!",
    });
  } catch (err) {
    this.next(err);
  }
};
