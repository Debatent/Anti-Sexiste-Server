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

const queryValidation = data => {
    const schema = Joi.object({
        page: Joi.number()
            .min(1)
            .integer(),
        sort: Joi.string()
            .valid('latest','popular'),
        label: Joi.string()
            .min(1)
            .max(32)
    });

    return schema.validateAsync(data);
};


module.exports.pageValidation = pageValidation;
module.exports.queryValidation = queryValidation;
