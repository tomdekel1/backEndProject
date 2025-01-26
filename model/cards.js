const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  subtitle: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  phone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 11,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
  },
  web: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },
  image: {
    url: { type: String, required: true, minlength: 6, maxlength: 1024 },
    alt: { type: String, required: true, minlength: 6, maxlength: 1024 },
  },
  address: {
    state: { type: String, required: true, minlength: 2, maxlength: 255 },
    country: { type: String, required: false, maxlength: 255 },
    city: { type: String, required: true, minlength: 2, maxlength: 255 },
    street: { type: String, required: true, minlength: 2, maxlength: 255 },
    houseNumber: { type: String, required: true, minlength: 2, maxlength: 255 },
    zip: { type: String, required: true, minlength: 2, maxlength: 255 },
  },
  bizNumber: {
    type: Number,
    required: true,
    min: 100,
    max: 9_999_999_999,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likes: {
    type: Array,
  },
  createdAt: { type: Date, default: Date.now },
});

const Card = mongoose.model("Card", cardSchema, "cards");

async function generateBizNumber() {
  while (true) {
    const random = _.random(100, 9_999_999_999);
    const card = await Card.findOne({ bizNumber: random });

    if (!card) {
      return random;
    }
  }
}

function validateCard(card) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    subtitle: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(1024).required(),
    phone: Joi.string().min(9).max(11).required(),
    email: Joi.string().min(6).max(255).required(),
    web: Joi.string().min(6).max(255).required(),
    image: Joi.object({
      url: Joi.string().min(2).max(255).required(),
      alt: Joi.string().min(2).max(255).required(),
    }),
    address: Joi.object({
      state: Joi.string().min(2).max(255).required(),
      country: Joi.string().min(2).max(255).required(),
      city: Joi.string().min(2).max(255).required(),
      street: Joi.string().min(2).max(255).required(),
      houseNumber: Joi.string().min(2).max(255).required(),
      zip: Joi.string().min(2).max(255).required(),
    }),
  });

  return schema.validate(card);
}

module.exports = { Card, validateCard, generateBizNumber };
