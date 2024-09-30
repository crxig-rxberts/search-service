const Joi = require('joi');

const submitDataSchema = Joi.object({
  providerName: Joi.string().min(2).max(100).required(),
  category: Joi.string().min(2).max(50).required(),
  userSub: Joi.string().uuid().required(),
  services: Joi.array().items(
    Joi.object({
      name: Joi.string().min(2).max(100).required(),
      cost: Joi.number().positive()
    })
  ).min(1)
});

const searchQuerySchema = Joi.object({
  query: Joi.string().min(1).max(100),
  category: Joi.string().min(2).max(50)
}).or('query', 'category');

const deleteDataSchema = Joi.object({
  id: Joi.string().required()
});

const validateDeleteData = (req, res, next) => {
  const { error } = deleteDataSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

const validateSubmitData = (req, res, next) => {
  const { error } = submitDataSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

const validateSearchQuery = (req, res, next) => {
  const { error } = searchQuerySchema.validate(req.query);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateDeleteData,
  validateSubmitData,
  validateSearchQuery
};
