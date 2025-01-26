const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../model/users");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

router.post("/", async (req, res) => {
  // validate user's input
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }
  //   validate system
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("invalid email");
    return;
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    res.status(400).send("invalid password");
    return;
  }

  const token = jwt.sign({ _id: user._id, biz: user.biz }, config.jwtKey);

  res.status(201).json({ token });
});

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required(),
    password: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(user);
}

module.exports = router;
