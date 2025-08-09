module.exports.index = async (req, res) => {
    res.render('admin/pages/rooms-chat/index', {
        pageTitle: 'Rooms Chat'
    });
};