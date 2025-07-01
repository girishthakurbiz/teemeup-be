import Joi from "joi";


const imageschema = Joi.object({
  type: Joi.string(),
  isRequired: Joi.boolean(),
});

export { imageschema};
