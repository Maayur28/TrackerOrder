const joi = require("joi");

let validator = {};
validator.addtoOrder = (obj) => {
  if (validator.getfromOrder(obj.userid)) {
    const schema = joi.object({
      quantity: joi.number().min(1).max(5).required(),
      size: joi.string().valid("XS", "S", "M", "L", "XL").required(),
      color: joi.string().required(),
      image: joi.string().required(),
      _id: joi.number().min(1).required(),
      name: joi.string().required(),
      description: joi.string().required(),
      rating: joi.number().min(1).max(5).required(),
      idealFor: joi.string().valid("men", "women", "kids").required(),
      category: joi.string().valid("Casual", "Formal", "Sports").required(),
      price: joi.number().min(1).required(),
      discount: joi.number().min(0).max(100).required(),
      shippingCharges: joi.number().min(0).required(),
    });
    for (let i of obj) {
      const { error, value } = schema.validate(i);
      if (error) return false;
    }
    return true;
  }
  else
  return false;
};
validator.getfromOrder = (id) => {
  const schema = joi.string().length(36).required();
  const { error, value } = schema.validate(id);
  if (error) return false;
  else return true;
};
module.exports = validator;
