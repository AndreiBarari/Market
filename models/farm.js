const mongoose = require('mongoose');
const Product = require('./product')
const Schema = mongoose.Schema;

const FarmSchema = new Schema ({
    farmName: String,
    farmerName: String,
    image: [
        {
        url: String,
        filename: String
    }
],
    geometry: {
        type: {
        type: String,
        enum: ['Point'],
        required: true
    },
        coordinates: {
        type: [Number],
        required: true
    }
},
    description: String,
    city: String,
    country: String,
    phone: Number,
    email: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
})

FarmSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Product.deleteMany({
            _id: {
                $in: doc.products
            }
        })
    }
})

module.exports = mongoose.model('Farm', FarmSchema);
