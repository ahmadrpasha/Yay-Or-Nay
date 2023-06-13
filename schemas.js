const Joi = require('joi');

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        yay: Joi.boolean(),
        nay: Joi.boolean(),
        clean: Joi.boolean(),
        unclean: Joi.boolean(),
        goodService: Joi.boolean(),
        badService: Joi.boolean(),
        details: Joi.string()
    }).required()
});

