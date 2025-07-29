const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const chatSchema = new mongoose.Schema({
    user_id: String,
    room_chat_id: String,
    content: String,
    image: Array,
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
const Chat = mongoose.model('chats', chatSchema, "chats");
module.exports = Chat;