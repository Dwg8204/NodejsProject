const systemConfig = require('../../config/system');

module.exports.createPost = async (req, res, next) => {
    if (!req.body.title ) {
        req.flash('error', 'Vui lòng nhập đầy đủ thông tin danh mục sản phẩm');
        return res.redirect(systemConfig.PrefixAdmin + '/products-category/create');
    }
    next();
}