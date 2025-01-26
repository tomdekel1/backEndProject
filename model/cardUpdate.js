const Joi = require("joi");

function validateCardUpdate(card) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    subtitle: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(1024).required(),
    phone: Joi.string().min(9).max(11).required(),
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

module.exports = { validateCardUpdate };
