const Farm = require('../models/farm');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index = async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', {
        farms
    });
};

module.exports.newFarm = (req, res) => {
    res.render('farms/new');
};

module.exports.createFarm = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.farm.city,
        limit: 1
    }).send()
    const farm = new Farm(req.body.farm);
    farm.geometry = geoData.body.features[0].geometry;
    farm.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    farm.author = req.user._id;
    await farm.save();
    // console.log(farm);
    res.redirect(`/farms/${farm._id}`)
}

module.exports.showFarm = async (req, res) => {
    const farm = await Farm.findById(req.params.id).populate('products').populate('author');
    res.render('farms/show', {
        farm
    });
}
module.exports.renderEdit = async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(req.params.id)
        if (!farm) {
            req.flash('error', 'Cannot find that farm!')
            return res.redirect('/farms')
        }
    res.render('farms/edit', { farm });
}

module.exports.editFarm = async (req, res) => {
    const {id} = req.params;
    const farm = await Farm.findByIdAndUpdate(id, {...req.body.farm});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    farm.image.push(...imgs);
    await farm.save();
    res.redirect(`/farms/${farm._id}`);
}

module.exports.deleteFarm = async (req, res) => {
    const {
        id
    } = req.params;
    await Farm.findByIdAndDelete(id);
    res.redirect('/farms')
}