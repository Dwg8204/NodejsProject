const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productsCategorySchema = new mongoose.Schema({
    title : String,
    description : String,
    thumbnail : String,
    status : String,
    parentId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductsCategory',
        default: null
    },
    position : Number,
    slug: {
        type: String,
        slug: "title" ,
        unique: true
    },
    deleted : {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }

},{
    timestamps: true
});
const ProductsCategory = mongoose.model('ProductsCategory', productsCategorySchema, "products-category");
module.exports = ProductsCategory;