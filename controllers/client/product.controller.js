const Product = require('../../models/product.model');

module.exports.index= async (req, res) => {
    const products = await Product.find({
    });
    const productNew = products.map(item => {
        item.priceOld = item.price * 100 / (100 - item.discountPercentage);
        return item;
    })
        res.render('client/pages/products/index.pug', {
            pageTitle: 'Sản phẩm',
            products: productNew
        });
}

module.exports.detail = async (req, res) => {
    const slug = req.params.slug;
    const find = {
        deleted: false,
        slug: slug,
        status: 'active'
    };
    const product = await Product.findOne(find);
    if (!product) {
        return res.status(404).send('Product not found');
    }
    res.render('client/pages/products/detail', {
        pageTitle: product.title,
        product: product
    });
}