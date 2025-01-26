const Joi = require("joi");

function validateUserUpdate(user) {
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
  });

  return schema.validate(user);
}

module.exports = { validateUserUpdate };
