// Validation
const Joi = require('@hapi/joi');

/** LABEL **/

const labelValidation = data => {
    const schema = Joi.object({
        name: Joi.string()
            .min(1)
            .max(32)
            .required(),
    });

    return schema.validateAsync(data);
};


module.exports.labelValidation = labelValidation;