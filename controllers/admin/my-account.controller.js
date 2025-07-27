const Account = require('../../models/account.model');
const Role = require('../../models/role.model');
const systemConfig = require('../../config/system');
const md5 = require('md5');

module.exports.index = async (req, res) => {
    const account = res.locals.account; 
    let role = null;
    if (account && account.role_id) {
        role = await Role.findOne({ _id: account.role_id });
    }
    res.render('admin/pages/my-account/index', {
        pageTitle: 'Thông tin tài khoản',
        role
    });
}