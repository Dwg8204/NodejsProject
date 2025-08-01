const Account = require('../../models/account.model');
const userSocket = require('../../sockets/admin/user.socket');
module.exports.notfriend = async (req, res) => {
    userSocket(res);
    const myId = res.locals.account._id.toString();
    const myUser = await Account.findOne ({
        _id: myId
    });
    const requestFriends = myUser.requestFriend || [];
    const acceptFriends = myUser.acceptFriend || [];
    const accounts = await Account.find({ 
        $and: [
            { _id: { $ne: myId } },
            { _id: { $nin: requestFriends } },
            { _id: { $nin: acceptFriends } },
            { status: 'active' },
            { deleted: false }
        ]
    }).select('fullName avatar');

    res.render('admin/pages/user/not-friend', {
        pageTitle: 'Danh sách người dùng không phải bạn bè',
        accounts: accounts
    });
}

module.exports.requests = async (req, res) => {
    userSocket(res);
    const myId = res.locals.account._id.toString();
    const myUser = await Account.findOne({
        _id: myId
    });
    const requestFriends = myUser.requestFriend || [];
    const acceptFriends = myUser.acceptFriend || [];
    const accounts = await Account.find({
        $and: [
            { _id: { $ne: myId } },
            { _id: { $in: requestFriends } },
            { status: 'active' },
            { deleted: false }
        ]
    }).select('fullName avatar');
    res.render('admin/pages/user/request', {
        pageTitle: 'Danh sách yêu cầu kết bạn',
        accounts: accounts
    });
}

module.exports.accepts = async (req, res) => {
    userSocket(res);
    const myId = res.locals.account._id.toString();
    const myUser = await Account.findOne({
        _id: myId
    });
    const requestFriends = myUser.requestFriend || [];
    const acceptFriends = myUser.acceptFriend || [];
    const accounts = await Account.find({
        $and: [
            { _id: { $ne: myId } },
            { _id: { $in: acceptFriends } },
            { status: 'active' },
            { deleted: false }
        ]
    }).select('fullName avatar');
    res.render('admin/pages/user/accept', {
        pageTitle: 'Danh sách bạn bè đã chấp nhận',
        accounts: accounts
    });
}