const Chat = require('../../models/chat.model');

module.exports = async(res) => {
    const userId = res.locals.account._id.toString();
    const fullName = res.locals.account.fullName;
    _io.once('connection', (socket) => {
            socket.on('TYPING', (data) => {
                socket.broadcast.emit('TYPING', data);
            });
            socket.on('STOP_TYPING', (data) => {
                socket.broadcast.emit('STOP_TYPING', data);
            });
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
}