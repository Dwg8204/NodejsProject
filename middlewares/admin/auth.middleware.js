const systemConfig = require('../../config/system');
const Account = require('../../models/account.model');
const Role = require('../../models/role.model');

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        req.flash('error', 'Bạn cần đăng nhập để truy cập');
        return res.redirect(systemConfig.PrefixAdmin + '/auth/login');
    }
    else{
        const account = await Account.findOne({
            token: req.cookies.token,
            deleted: false
        }).select("-password");
        if (!account) {
            req.flash('error', 'Phiên đăng nhập không hợp lệ');
            return res.redirect(systemConfig.PrefixAdmin + '/auth/login');
        }
        else{
            res.locals.account = account;
            next();
        }
    }
};