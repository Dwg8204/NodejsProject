const systemConfig = require('../../config/system');
const ProductsCategory = require('../../models/products-category.model');

module.exports.index = async (req, res) => {
    let find = {
        deleted : false
    };
//    Phân trang
    let pagination = {
        currentPage: 1,
        limitItem: 4
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
        
    }
    pagination.skip = (pagination.currentPage - 1) * pagination.limitItem;
    const totalProducts = await ProductsCategory.countDocuments(find);
    const totalPage = Math.ceil(totalProducts / pagination.limitItem);
    pagination.totalPage = totalPage;
    const productsCategory = await ProductsCategory.find(
            find
        ).sort({position: 1}) 
        .limit(pagination.limitItem)
        .skip(pagination.skip);
    res.render('admin/pages/products-category/index', {
        pageTitle: 'Products Category Management',
        productsCategory: productsCategory,
        pagination: pagination
    });
}

module.exports.create = async (req, res) => {
    res.render('admin/pages/products-category/create', {
        pageTitle: 'Create Product Category',

    });
}


// POST
module.exports.createPost = async (req, res) => {
    if(req.body.position==""){
        const countProducts= await ProductsCategory.countDocuments();;
        req.body.position=countProducts + 1;
    }
    else{
        req.body.position = parseInt(req.body.position);
    }

    const productsCategory = new ProductsCategory(req.body);
    await productsCategory.save();
    res.redirect(systemConfig.PrefixAdmin + '/products-category');
}
