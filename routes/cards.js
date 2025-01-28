const express = require("express");
const router = express.Router();
const { User } = require("../model/users");
const authMW = require("../middleware/auth");
const validateCardAuthor = require("../middleware/validateCardAuthor");
const { Card, generateBizNumber, validateCard } = require("../model/cards");
const { validateCardUpdate } = require("../model/cardUpdate");
const _ = require("lodash");

router.post("/", authMW, async (req, res) => {
  console.log(req.body);
  const { error } = validateCard(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  if (!req.user.biz) {
    res.status(400).send("user must be of type business to create a card");
    return;
  }
  let card = await Card.findOne({ email: req.body.email });
  if (card) {
    res.status(400).send("business already exists, email exists in system");
    return;
  }
  try {
    card = await new Card({
      ...req.body,
      bizImage:
        req.body.bizImage ??
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      user_id: req.user._id,
      bizNumber: await generateBizNumber(),
    }).save();

    res.status(201).json(card);
  } catch (e) {
    res.status(400).send(e);
    return;
  }
});

router.get("/", async (req, res) => {
  try {
    res.status(200).json(await Card.find());
  } catch (e) {
    res.status(400).send(e.message);
    return;
  }
});

router.get("/my-cards", authMW, async (req, res) => {
  if (req.user.biz == false) {
    res.status(400).send("this user is not a business user");
    return;
  }
  const userCards = await Card.find({ user_id: req.user._id });
  res.status(200).json(userCards);
  return;
});

router.get("/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      res.status(404).send("card not found");
      return;
    }
    res.status(200).json(card);
    return;
  } catch (e) {
    res.status(400).send(e);
    return;
  }
});

router.put("/:id", authMW, validateCardAuthor, async (req, res) => {
  const { error } = validateCardUpdate(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }
  try {
    let updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedCard);
  } catch (e) {
    res.status(400).send(e.message);
    return;
  }
});

router.patch("/:id", authMW, async (req, res) => {
  let card;
  try {
    card = await Card.findById(req.params.id);
  } catch (e) {
    res.status(400).send(e.message);
    return;
  }

  if (!card) {
    res.status(404).send("card not found");
    return;
  }

  if (card.likes.includes(req.user._id)) {
    const newLikesArray = _.pull(card.likes, req.user._id);
    card = await Card.findByIdAndUpdate(
      req.params.id,
      { likes: newLikesArray },
      { new: true }
    );
    res.status(200).json(card);
    return;
  }

  card = await Card.findByIdAndUpdate(
    req.params.id,
    { likes: [...card.likes, req.user._id] },
    { new: true }
  );
  res.status(200).json(card);
});

router.delete("/:id", authMW, validateCardAuthor, async (req, res) => {
  let card;
  try {
    card = await Card.findByIdAndDelete(req.params.id);
    res.status(200).json(card);
    return;
  } catch (e) {
    res.status(400).send(e.message);
    return;
  }
});

// bonus** admin only ** biznumberchange
router.patch("/biznumberchange/:id", authMW, async (req, res) => {
  let requestingUser = await User.findById(req.user._id, ["isAdmin"]);

  if (!requestingUser.isAdmin || requestingUser.isAdmin == false) {
    res.status(400).send("only admin can access this route");
    return;
  }
  try {
    let uniqueNumberCheck = await Card.findOne({
      bizNumber: req.body.newBizNumber,
    });
    if (uniqueNumberCheck) {
      res.status(400).send("business number already exists");
      return;
    }
    if (req.body.newBizNumber.length > 10) {
      res.status(400).send("invalid business number");
      return;
    }
  } catch (e) {
    res.status(400).send(e.message);
    return;
  }
  let newBizCard = await Card.findByIdAndUpdate(
    req.params.id,
    {
      bizNumber: req.body.newBizNumber,
    },
    { new: true }
  );
  if (!newBizCard) {
    res.status(404).send("card not found");
    return;
  }
  console.log(newBizCard);
  res.status(200).json(newBizCard);
});

module.exports = router;
