const Chat = require('../../models/chat.model');

module.exports = async(req,res) => {
    const userId = res.locals.account._id.toString();
    const fullName = res.locals.account.fullName;
    const roomChatId = req.params.roomChatId;
    _io.once('connection', (socket) => {
            socket.join(roomChatId);
            socket.on('TYPING', (data) => {
                socket.broadcast.to(roomChatId).emit('TYPING', data);
            });
            socket.on('STOP_TYPING', (data) => {
                socket.broadcast.to(roomChatId).emit('STOP_TYPING', data);
            });
            socket.on('CLIENT_SEND_MESSAGE', async (data) => {
                const { content, userId } = data;
                

                // Lưu vào cơ sở dữ liệu
                const chat = new Chat({
                    user_id: userId,
                    content: content,
                    room_chat_id: roomChatId,
                    createdAt: new Date()
                });
                await chat.save();
                // Trả data về cho client
                _io.to(roomChatId).emit('SERVER_RETURN_MESSAGE', {
                    userId: userId,
                    fullName: fullName,
                    content: content,
                    createdAt: new Date()
                });
            });
        
        });
}