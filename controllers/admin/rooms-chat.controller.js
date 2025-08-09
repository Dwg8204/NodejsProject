const User = require('../../models/account.model');
const RoomChat = require('../../models/room-chat.model');
const systemConfig = require('../../config/system');
module.exports.index = async (req, res) => {
    res.render('admin/pages/rooms-chat/index', {
        pageTitle: 'Rooms Chat'
    });
};

module.exports.create = async (req, res) => {
    const listFriend= res.locals.account.friendList;
    // console.log(listFriends);
    for (const friend of listFriend) {
        const infoFriend = await User.findOne({
            _id: friend.user_id
        }).select('fullName avatar');

        friend.infoFriend = infoFriend;
    }

    res.render('admin/pages/rooms-chat/create', {
        pageTitle: 'Tạo phòng chat',
        listFriend: listFriend
    });
};

module.exports.createPost = async (req, res) => {
    const title = req.body.title;
    const usersId = req.body.usersId;

    const dataChat = {
        title: title,
        typeRoom: "group",
        users: [
           
        ]
    };

    usersId.forEach(userId => {
        dataChat.users.push({
            userId: userId,
            role: "user"
        });
    });
    dataChat.users.push({
            userId: res.locals.account.id,
            role: "superadmin"
    });
    console.log(dataChat);
    const room = new RoomChat(dataChat);
    await room.save();
    res.redirect(systemConfig.PrefixAdmin + "/chat/" + room.id);
    // res.send("OK");
    
};
