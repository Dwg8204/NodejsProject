const Chat = require('../../models/chat.model');
const User = require('../../models/account.model');

module.exports = async(res) => {
    const myUserId = res.locals.account._id.toString();
    const fullName = res.locals.account.fullName;
    _io.once('connection', (socket) => {
            socket.on('CLIENT_ADD_FRIEND', async (userId) => {
                // console.log(userId); //ID CỦA BẠN ĐƯỢC THÊM
                // console.log(myUserId); //ID CỦA MÌNH
                // Thêm id của A vào acceptFriends của B
                const exitsUser = await User.findOne({
                    _id: userId,
                    acceptFriend: myUserId
                });
                if (!exitsUser) {
                    console.log("Adding myUserId to acceptFriends");
                    await User.updateOne(
                        { _id: userId },
                        { $push: { acceptFriend: myUserId } }
                    );
                }
                // Thêm id của B vào requestFriends của A
                const exitsMyUser = await User.findOne({
                    _id: myUserId,
                    requestFriend: userId
                });
                if (!exitsMyUser) {
                    console.log("Adding user to requestFriends");
                    await User.updateOne(
                        { _id: myUserId },
                        { $push: { requestFriend: userId } }
                    );
                }

        });
    
});
};