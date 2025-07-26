const Account = require('../../models/account.model');
const Role = require('../../models/role.model');
const systemConfig = require('../../config/system');
const md5 = require('md5');

module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    const roles = await Role.find(find).sort({ createdAt: -1 });
    const accounts = await Account.find(find).sort({ createdAt: -1 });

    res.render('admin/pages/accounts/index', {
        pageTitle: 'Danh sách tài khoản',
        accounts: accounts,
        roles: roles
    });
}

module.exports.create = async (req, res) => {
    const roles = await Role.find({
         deleted: false 
    }).sort({ createdAt: -1 });

    res.render('admin/pages/accounts/create', {
        pageTitle: 'Tạo tài khoản',
        roles: roles
    });
}

module.exports.createPost = async (req, res) => {
    req.body.password = md5(req.body.password);
    const emailExists = await Account.findOne({
        email: req.body.email,
        deleted: false
    });
    if (emailExists) {
        req.flash('error', 'Email đã tồn tại');
        return res.redirect(systemConfig.PrefixAdmin + '/accounts/create');
    }
    if (req.file) {
        req.body.avatar = req.file.filename;
    }
    const account = new Account(req.body);
    await account.save();
    res.redirect(systemConfig.PrefixAdmin + '/accounts');
}
