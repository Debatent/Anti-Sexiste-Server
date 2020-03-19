// Validation
const Joi = require('@hapi/joi');

/** POST **/

const postValidation = data => {
    const schema = Joi.object({
        title: Joi.string()
            .min(1)
            .max(64)
            .required(),
        message: Joi.string()
            .min(10)
            .max(512)
            .required(),
        location: Joi.string()
            .min(1)
            .max(32)
            .required()
    });

    return schema.validateAsync(data);
};


module.exports.postValidation = postValidation;