const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const roomChatSchema = new mongoose.Schema({
    title: String,
    avatar: String,
    theme: String,
    typeRoom: String,
    status: String,
    users: [
        {
            userId: String,
            role: String // 'admin', 'member', etc.
        }
    ],
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
},{
    timestamps: true
});
const RoomChat = mongoose.model('roomChat', roomChatSchema, "rooms-chat");
module.exports = RoomChat;