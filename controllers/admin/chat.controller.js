module.exports.index = async (req, res) => {
        _io.on('connection', (socket) => {
        console.log('a user connected', socket.id);
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
    res.render('admin/pages/chat/index', {
        pageTitle: 'Chat '
    });
};
