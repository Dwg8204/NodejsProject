const systemConfig = require('../../config/system');

module.exports.createPost = async (req, res, next) => {
    if (!req.body.title || !req.body.price) {
        req.flash('error', 'Vui lòng nhập đầy đủ thông tin sản phẩm');
        return res.redirect(systemConfig.PrefixAdmin + '/products/create');
    }
    next();
}