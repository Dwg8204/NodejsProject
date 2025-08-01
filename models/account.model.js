const mongoose = require('mongoose');
const generate = require('../helpers/generate');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const accountSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    token: {
        type: String,
        default: generate.generateRandomString(20)
    },
    phone: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: null
    },
    role_id: {
        type: String
    },
    acceptFriend: Array,
    requestFriend: Array,
    friendList: [
        {
            user_id: String,
            room_chat_id: String
        }
    ],
    status: {
        type: String,
        default: 'active'
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});
const Account = mongoose.model('Account', accountSchema, "accounts");
module.exports = Account;
