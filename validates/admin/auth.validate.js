const systemConfig = require('../../config/system');

module.exports.loginPost = async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        req.flash('error', 'Vui lòng nhập đầy đủ thông tin đăng nhập');
        return res.redirect(systemConfig.PrefixAdmin + '/auth/login');
    }
    
    next();
}