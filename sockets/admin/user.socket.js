const Chat = require('../../models/chat.model');
const User = require('../../models/account.model');
const RoomChat = require('../../models/room-chat.model');

const onlineUsers = new Set();
module.exports = async(res) => {
    const myUserId = res.locals.account._id.toString();
    const fullName = res.locals.account.fullName;
    _io.once('connection', (socket) => {
            socket.on('CLIENT_USER_ONLINE', async (userId) => {
                if (!userId) {
                    console.error('User ID is required to set online status.');
                    return;
                }
                socket.broadcast.emit('SERVER_RETURN_USER_ONLINE', userId);
            });
            socket.on('disconnect', async () => {
                const userId = myUserId;
                if(userId) {
                    await User.updateOne(
                        { _id: userId },
                        { statusOnline: false }
                    );
                }
                socket.broadcast.emit('SERVER_RETURN_USER_OFFLINE', userId);
            });


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
                //Lấy độ dài acceptFriends của B trả về cho B
                const infoUserB = await User.findOne({
                    _id: userId
                }).select('acceptFriend');

                const lengthAcceptFriends = infoUserB ? infoUserB.acceptFriend.length : 0;
                socket.broadcast.emit('SERVER_RETURN_LENGTH_ACCEPT_FRIEND', {
                    userId: userId,
                    lengthAcceptFriends: lengthAcceptFriends
                });
                //Lấy độ dài requestFriends của A trả về cho A
                const infoUserA = await User.findOne({
                    _id: myUserId
                }).select('requestFriend');
                const lengthRequestFriends = infoUserA.requestFriend.length;
                socket.emit('SERVER_RETURN_LENGTH_REQUEST_FRIEND', {
                    userId: myUserId,
                    lengthRequestFriends: lengthRequestFriends
                });
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
            socket.on('CLIENT_ACCEPT_FRIEND', async (userId) => {
                if (!userId) {
                    console.error('User ID is required to accept friend request.');
                }
                // console.log(userId);
                // console.log(myUserId);
                // Thêm id của A vào friendList của B
                
                const exitUserAInB = await User.findOne({
                    _id: userId,
                    friendList: { $elemMatch: { user_id: myUserId } }
                });
                // Thêm id của B vào friendList của A
                const exitUserBInA = await User.findOne({
                    _id: myUserId,
                    friendList: { $elemMatch: { user_id: userId } }
                });
               //Tạo phòng chat chung
                let roomChat;
                if (!exitUserAInB || !exitUserBInA) {
                    roomChat = new RoomChat({
                        typeRoom: 'friend',
                        status: 'active',
                        users: [
                            { userId: myUserId, role: 'superadmin' },
                            { userId: userId, role: 'superadmin' }
                        ]
                    });
                    await roomChat.save();
                    console.log("Room chat created successfully");
                }
                if (!exitUserAInB) {
                    console.log("Adding myUserId to friendList of userId");
                    await User.updateOne(
                        { _id: userId },
                        { $push: { friendList: { 
                            user_id: myUserId,
                            room_chat_id: roomChat._id
                        } } }
                    );
                }
                

                if (!exitUserBInA) {
                    console.log("Adding userId to friendList of myUserId");
                    await User.updateOne(
                        { _id: myUserId },
                        { $push: { friendList: { user_id: userId, room_chat_id: roomChat._id } } }
                    );
                }
                // Xóa id của B khỏi acceptFriends của A
                const exitUserBInA2 = await User.findOne({
                    _id: myUserId,
                    acceptFriend: userId
                });
                if (exitUserBInA2) {
                    await User.updateOne(
                        { _id: myUserId },
                        { $pull: { acceptFriend: userId } }
                    );
                }
                // Xóa id của B khỏi requestFriends của A
                const exitUserAInB2 = await User.findOne({
                    _id: userId,
                    requestFriend: myUserId
                });
                if (exitUserAInB2) {
                    await User.updateOne(
                        { _id: userId },
                        { $pull: { requestFriend: myUserId } }
                    );
                }
            });
            socket.on('CLIENT_REMOVE_FRIEND', async (userId) => {
                if (!userId) {
                    console.error('User ID is required to remove friend.');
                }
                const exitUserAInB = await User.findOne({
                    _id: userId,
                    friendList: { $elemMatch: { user_id: myUserId } }
                });
                if (exitUserAInB) {
                    await User.updateOne(
                        { _id: userId },
                        { $pull: { friendList: { user_id: myUserId } } }
                    );
                }
                const exitUserBInA = await User.findOne ({
                    _id: myUserId,
                    friendList: { $elemMatch: {user_id: userId}}
                });
                if (exitUserBInA) {
                    await User.updateOne(
                        { _id: myUserId },
                        { $pull: { friendList: { user_id: userId } } }
                    );
                }
            });

        });
};