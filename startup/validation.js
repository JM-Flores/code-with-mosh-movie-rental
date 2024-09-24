import Joi from "joi";
import joiObjectid from "joi-objectid";
function validation() {
  Joi.objectId = joiObjectid(Joi);
}

export default validation;
