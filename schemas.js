const Joi = require('joi')

module.exports.farmSchema = Joi.object({
    farm: Joi.object({
        farmName: Joi.string().required(),
        farmerName: Joi.string().required(),
        // image: Joi.string().required(),
        description: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.number().required()
    }).required()
});

module.exports.productSchema = Joi.object({
    product: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        unit: Joi.string().required(),
        info: Joi.string().required()
    })
})