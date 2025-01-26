const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    first: { type: String, required: true, minlength: 2, maxlength: 255 },
    middle: { type: String, required: false, maxlength: 255 },
    last: { type: String, required: true, minlength: 2, maxlength: 255 },
  },
  address: {
    state: { type: String, required: true, minlength: 2, maxlength: 255 },
    country: { type: String, required: false, maxlength: 255 },
    city: { type: String, required: true, minlength: 2, maxlength: 255 },
    street: { type: String, required: true, minlength: 2, maxlength: 255 },
    houseNumber: { type: String, required: true, minlength: 2, maxlength: 255 },
    zip: { type: String, required: true, minlength: 2, maxlength: 255 },
  },
  image: {
    url: { type: String, required: true, minlength: 6, maxlength: 1024 },
    alt: { type: String, required: true, minlength: 6, maxlength: 1024 },
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
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  isAdmin: { type: Boolean, default: false },
  biz: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema, "users");

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.object({
      first: Joi.string().min(2).max(255).required(),
      middle: Joi.string().max(255).allow(""),
      last: Joi.string().min(2).max(255).required(),
    }),
    address: Joi.object({
      state: Joi.string().min(2).max(255).required(),
      country: Joi.string().min(2).max(255).required(),
      city: Joi.string().min(2).max(255).required(),
      street: Joi.string().min(2).max(255).required(),
      houseNumber: Joi.string().min(2).max(255).required(),
      zip: Joi.string().min(2).max(255).required(),
    }),
    image: Joi.object({
      url: Joi.string().min(2).max(255).required(),
      alt: Joi.string().min(2).max(255).required(),
    }),
    phone: Joi.string().min(9).max(11).required(),
    email: Joi.string().min(6).max(255).required(),
    password: Joi.string().min(6).max(1024).required(),
    biz: Joi.boolean().required(),
  });

  return schema.validate(user);
}

module.exports = { User, validateUser };
