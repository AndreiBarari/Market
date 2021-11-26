
const Farm = require('../models/farm');
const Product = require('../models/product');

module.exports.createProduct = async (req, res) => {
    const {id} = req.params;
    const farm = await Farm.findById(req.params.id);
    const product = new Product(req.body.product);
     farm.products.push(product);
     await product.save();
     await farm.save();
     res.redirect(`/farms/${farm._id}`);
 };

 module.exports.deleteProduct = async (req, res) => {
    const { id, productId } = req.params;
    await Farm.findByIdAndUpdate(id, { $pull: { products: productId } });
    await Product.findByIdAndDelete(productId);
    res.redirect(`/farms/${id}`);
};