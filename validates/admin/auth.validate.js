const Account = require('../../models/account.model');
const systemConfig = require('../../config/system');
const md5 = require('md5');

module.exports.loginPost = async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        req.flash('error', 'Vui lòng nhập đầy đủ thông tin đăng nhập');
        return res.redirect(systemConfig.PrefixAdmin + '/auth/login');
    }

    const account = await Account.findOne({
        email: req.body.email,
        password: md5(req.body.password),
        deleted: false
    });

    if (!account) {
        req.flash('error', 'Email hoặc mật khẩu không đúng');
        return res.redirect(systemConfig.PrefixAdmin + '/auth/login');
    }

    next();
}