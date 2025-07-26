const Account = require('../../models/account.model');
const Role = require('../../models/role.model');
const systemConfig = require('../../config/system');
const md5 = require('md5');

module.exports.login = async (req, res) => {
    if (req.cookies.token) {
        const account = await Account.findOne({
            token: req.cookies.token,
            deleted: false
        });
        if (account) {
            return res.redirect(systemConfig.PrefixAdmin + '/dashboard');
        }
    }
    else{
        res.render('admin/pages/auth/login', {
        pageTitle: 'Đăng nhập'
    });
    }
}
module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;
    const account = await Account.findOne({
        email: email,
        password: md5(password),
        deleted: false
    });
    
    res.cookie('token', account.token);
    req.flash('success', 'Đăng nhập thành công');
    return res.redirect(systemConfig.PrefixAdmin + '/dashboard');
}

module.exports.logout = async (req, res) => {
    res.clearCookie('token');
    req.flash('success', 'Đăng xuất thành công');
    return res.redirect(systemConfig.PrefixAdmin + '/auth/login');
}