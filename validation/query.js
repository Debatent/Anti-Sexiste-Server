// Validation
const Joi = require('@hapi/joi');

/** PAGINATION **/

const pageValidation = data => {
    const schema = Joi.object({
        page: Joi.number()
            .min(1)
            .integer()
            .default(1)
    });

    return schema.validateAsync(data);
};


module.exports.pageValidation = pageValidation;