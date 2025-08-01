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
            socket.on('CLIENT_CANCEL_FRIEND', async (userId) => {
                if (!userId) {
                    console.error('User ID is required to cancel friend request.');
                }
                // console.log(userId); 
                // console.log(myUserId); 
                // Xóa id của A khỏi acceptFriends của B
                const exitUserAInB = await User.findOne({
                    _id: userId,
                    acceptFriend: myUserId
                });
                if (exitUserAInB) {
                    await User.updateOne(
                        { _id: userId },
                        { $pull: { acceptFriend: myUserId } }
                    );
                }
                // Xóa id của B khỏi requestFriends của A
                const exitUserBInA = await User.findOne({
                    _id: myUserId,
                    requestFriend: userId
                });
                if (exitUserBInA) {
                    await User.updateOne(
                        { _id: myUserId },
                        { $pull: { requestFriend: userId } }
                    );
                }
            });
            socket.on('CLIENT_REFUSE_FRIEND', async (userId) => {
                if (!userId) {
                    console.error('User ID is required to refuse friend request.');
                }
                // console.log(userId);
                // console.log(myUserId);
                // Xóa id của A khỏi requestFriends của B
                const exitUserAInB = await User.findOne({
                    _id: userId,
                    requestFriend: myUserId
                });
                if (exitUserAInB) {
                    await User.updateOne(
                        { _id: userId },
                        { $pull: { requestFriend: myUserId } }
                    );
                }
                // Xóa id của B khỏi acceptFriends của A
                const exitUserBInA = await User.findOne({
                    _id: myUserId,
                    acceptFriend: userId
                });
                if (exitUserBInA) {
                    await User.updateOne(
                        { _id: myUserId },
                        { $pull: { acceptFriend: userId } }
                    );
                }
            });
            

        });
};