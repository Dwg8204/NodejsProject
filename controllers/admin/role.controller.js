const Role = require('../../models/role.model');
const systemConfig = require('../../config/system');

module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    const roles = await Role.find(find).sort({ createdAt: -1 });

    res.render('admin/pages/roles/index', {
        pageTitle: 'Danh sách nhóm quyền',
        roles: roles
    });
}

module.exports.create = (req, res) => {
    res.render('admin/pages/roles/create', {
        pageTitle: 'Tạo nhóm quyền'
    });
}

module.exports.createPost = async (req, res) => {
    const role = new Role({
        title: req.body.title,
        description: req.body.description
    });
    await role.save();
    res.redirect(systemConfig.PrefixAdmin + '/roles');
}

module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false
    };
    const roles = await Role.find(find).sort({ createdAt: -1 });

    res.render('admin/pages/roles/permissions', {
        pageTitle: 'Phân quyền',
        roles: roles
    });
}

module.exports.permissionsPatch = async (req, res) => {
    const permissions = JSON.parse(req.body.permissions);
    for (const permission of permissions) {
        const role = await Role.findById(permission.id);
        if (role) {
            role.permissions = permission.permissions;
            await role.save();
        }
    }
    req.flash('success', 'Cập nhật quyền thành công');
    res.redirect(systemConfig.PrefixAdmin + '/roles/permissions');
}


