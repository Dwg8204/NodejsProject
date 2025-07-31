const Account = require('../../models/account.model');

module.exports.notfriend = async (req, res) => {
    const myId = res.locals.account._id.toString();
    const accounts = await Account.find({ 
        status: 'active',
        _id: { $ne: myId },
        deleted: false,
        }).select('fullName avatar');
    
    res.render('admin/pages/user/not-friend', {
        pageTitle: 'Danh sách người dùng không phải bạn bè',
        accounts: accounts
    });
}