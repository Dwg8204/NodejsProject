const Account = require('../../models/account.model');
const Role = require('../../models/role.model');
const systemConfig = require('../../config/system');
const md5 = require('md5');

module.exports.login = async (req, res) => {
    res.render('admin/pages/auth/login', {
        pageTitle: 'Đăng nhập'
    });
}
module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;
    const account = await Account.findOne({
        email: email,
        password: md5(password),
        deleted: false
    });
    // if (!account) {
    //     req.flash('error', 'Email hoặc mật khẩu không đúng');
    //     return res.redirect(systemConfig.PrefixAdmin + '/auth/login');
    // }
    // if (account.status !== 'active') {
    //     req.flash('error', 'Tài khoản của bạn đã bị khóa');
    //     return res.redirect(systemConfig.PrefixAdmin + '/auth/login');
    // }
    res.cookie('token', account.token);
    req.flash('success', 'Đăng nhập thành công');
    return res.redirect(systemConfig.PrefixAdmin + '/dashboard');
}