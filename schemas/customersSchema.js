import joi from "joi";

const customersSchema = joi.object({
  name: joi.string().required(),
  phone: joi.string().required().min(10).max(11),
  cpf: joi.string().required().length(11),
  birthday: joi.date().required()
});

export default customersSchema;