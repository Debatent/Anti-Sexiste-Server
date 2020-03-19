// Validation
const Joi = require('@hapi/joi');

/** REGISTER **/

const registerValidation = data => {
    const schema = Joi.object({
        pseudo: Joi.string()
            .min(1)
            .max(32)
            .alphanum()
            .required(),
        email: Joi.string()
            .min(6)
            .max(64)
            .email()
            .required(),
        password: Joi.string()
            .min(6)
            .max(64)
            .required()
    });

    return schema.validateAsync(data);
};


/** LOGIN **/

const loginValidation = data => {
    const schema = Joi.object({
        user: Joi.string()
            .min(1)
            .max(64)
            .required(),
        password: Joi.string()
            .min(6)
            .max(64)
            .required()
    });

    return schema.validateAsync(data);
};

const emailValidation = data => {
    const schema = Joi.object({
        user: Joi.string().email()
    });
    return schema.validateAsync(data);
};


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.emailValidation = emailValidation;