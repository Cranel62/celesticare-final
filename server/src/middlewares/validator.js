import Joi from 'joi';

export const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation Error',
      errors: error.details.map((err) => err.message)
    });
  }
  next();
};

export const registerSchema = Joi.object({
  username: Joi.string().pattern(/^[a-zA-Z0-9_-]+$/).min(2).max(30).required().messages({
    'string.pattern.base': 'Username can only contain letters, numbers, underscores, and hyphens'
  }),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin').default('user'),
  name: Joi.string().allow('', null),
  birthdate: Joi.string().allow('', null),
  gender: Joi.string().allow('', null),
  zodiac_sign: Joi.string().allow('', null),
  undertone: Joi.string().allow('', null),
  season: Joi.string().allow('', null)
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const outfitSchemaValidation = Joi.object({
  clothing_style: Joi.string().required(),
  gender: Joi.string().required(),
  clothing_category: Joi.string().allow('', null),
  clothing_src: Joi.string().allow('', null),
  outfit_data: Joi.array().items(Joi.object()).default([])
});

export const orderSchemaValidation = Joi.object({
  items: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      price: Joi.number().positive().required(),
      quantity: Joi.number().integer().min(1).required(),
      image: Joi.string().allow('', null)
    })
  ).min(1).required(),
  totalAmount: Joi.number().positive().required(),
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().default('Philippines')
  }).required()
});