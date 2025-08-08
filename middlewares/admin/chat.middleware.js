const systemConfig = require('../../config/system');
const Account = require('../../models/account.model');
const Role = require('../../models/role.model');
const RoomChat = require('../../models/room-chat.model');


module.exports.isAccess = async (req, res, next) => {
    const userId = res.locals.account._id.toString();
    const roomChatId = req.params.roomChatId;

    // Kiểm tra xem người dùng có quyền truy cập vào phòng chat này không
    try {

        const isAcessRoomChat = await RoomChat.findOne({
            _id: roomChatId,
            "users.userId": userId,
            deleted: false
        });
        if (!isAcessRoomChat) {
            return res.redirect(systemConfig.PrefixAdmin);
        }
        else{
            next();

        }
    } catch (error) {
        console.log(error);
        return res.redirect(systemConfig.PrefixAdmin);
    }
};