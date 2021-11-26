const {farmSchema, productSchema} = require('./schemas');
const ExpressError = require('./utilities/ExpressError')
const Farm = require('./models/farm')


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must sign in first!');
        return res.redirect('/login');
     }
     next();
}

module.exports.isAuthor = async(req,res, next) => {
    const {id} = req.params;
    const farm = await Farm.findById(id);
    if(!farm.author.equals(req.user._id)){
    req.flash('error', 'You do not have permission to do that!')
    return res.redirect(`/farms/${id}`)
    }
    next();
}

module.exports.validateForm = (req, res, next) => {
    const {error} = farmSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.validateProduct = (req, res, next) => {
    const{error} = productSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}