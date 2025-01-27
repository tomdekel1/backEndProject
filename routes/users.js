const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../model/users");
const { validateUserUpdate } = require("../model/userUpdate");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const authMW = require("../middleware/auth");
const validateUserIdMW = require("../middleware/validateUserId");

router.get("/", authMW, async (req, res) => {
  let user = await User.findById(req.user._id, ["isAdmin"]);
  if (!user) {
    res.status(400).send("user does not exist in system");
    return;
  }
  if (!user.isAdmin || user.isAdmin == "false") {
    res.status(400).send("only admins can access this route");
    return;
  }
  const allUsers = await User.find({}, { password: 0 });
  res.status(200).json(allUsers);
});

// get user details
router.get("/:id", authMW, validateUserIdMW, async (req, res) => {
  try {
    let user = await User.findById(req.params.id, { password: 0 });
    if (!user) {
      res.status(400).send("wrong id, user does not exist");
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(400).send(err.message);
    return;
  }
});

//signup new user
router.post("/", async (req, res) => {
  // validate user input
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }

  // check if user already exists via email
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).send("user already exists, email exists in system");
    return;
  }
  // process

  user = await new User(req.body);
  user.password = await bcrypt.hash(user.password, 12);
  await user.save();
  const userData = _.pick(user, ["name", "email", "_id", "biz"]);
  // response

  res.status(201).json(userData);
});

// update user info
router.put("/:id", authMW, validateUserIdMW, async (req, res) => {
  const { error } = validateUserUpdate(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }
  try {
    let updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      res.status(404).send("user not found");
      return;
    }

    updatedUser = _.pick(updatedUser, [
      "name",
      "address",
      "image",
      "_id",
      "phone",
      "email",
      "biz",
    ]);

    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(400).send(err.message);
    console.log("catched err");
  }
});

router.patch("/:id", authMW, validateUserIdMW, async (req, res) => {
  const userBeforeUpdate = await User.findById(req.params.id);
  if (!userBeforeUpdate) {
    res.status(404).send("user not found");
    return;
  }
  let updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { biz: `${!userBeforeUpdate.biz}` },
    { new: true },
    { password: 0 }
  );
  updatedUser = _.pick(updatedUser, [
    "name",
    "address",
    "image",
    "_id",
    "phone",
    "email",
    "biz",
  ]);
  res.status(200).json(updatedUser);
});

router.delete("/:id", authMW, validateUserIdMW, async (req, res) => {
  try {
    let user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(400).send("user not found");
      return;
    }
    user = _.pick(user, [
      "name",
      "address",
      "image",
      "_id",
      "phone",
      "email",
      "biz",
    ]);
    res.status(200).json(user);
    return;
  } catch (e) {
    res.status(400).send(e.message);
    return;
  }
});

module.exports = router;
