// Validation
const Joi = require('@hapi/joi');

/** COMMENT **/

const commentValidation = data => {
    const schema = Joi.object({
        message: Joi.string()
            .min(10)
            .max(512)
            .required(),
        type: Joi.string()
            .min(1)
            .max(32)
            .required()
    });

    return schema.validateAsync(data);
};


module.exports.commentValidation = commentValidation;