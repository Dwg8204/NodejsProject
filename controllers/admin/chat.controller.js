const Chat = require('../../models/chat.model');
const account = require('../../models/account.model');

module.exports.index = async (req, res) => {
    const userId = res.locals.account._id.toString();
    const fullName = res.locals.account.fullName;
    _io.once('connection', (socket) => {
            socket.on('CLIENT_SEND_MESSAGE', async (data) => {
                const { content, userId } = data;
                

                // Lưu vào cơ sở dữ liệu
                const chat = new Chat({
                    user_id: userId,
                    content: content
                });
                await chat.save();
                // Trả data về cho client
                _io.emit('SERVER_RETURN_MESSAGE', {
                    userId: userId,
                    fullName: fullName,
                    content: content,
                    createdAt: new Date()
                });
            });
        
        });
    // Lấy tất cả tin nhắn
    const chats = await Chat.find({ deleted: false });

    // Tìm user_id khác userId hiện tại (nick đối phương)
    const opponentChat = chats.find(chat => chat.user_id.toString() !== userId);
    let opponent = null;
    if (opponentChat) {
        opponent = await account.findOne({ _id: opponentChat.user_id }).select('fullName avatar');
    }

    // Gắn infoUser cho từng chat
    for (const chat of chats) {
        const infoUser = await account.findOne({ _id: chat.user_id }).select('fullName avatar');
        chat.infoUser = infoUser;
        chat.infoUser.userId = chat.user_id.toString();
    }

    res.render('admin/pages/chat/index', {
        pageTitle: 'Chat',
        chats: chats,
        userId: userId,
        opponent: opponent
            ? {
                fullName: opponent.fullName,
                avatar: opponent.avatar || '/images/user-avatar.png'
            }
            : { fullName: '', avatar: '/images/user-avatar.png' }
    });
};