const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const roleSchema = new mongoose.Schema({
    title : String,
    description : String,
    permissions : {
        type: Array,
        default: []
    }, 
    // Nhóm quyền
    deleted : {
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
const Role = mongoose.model('roles', roleSchema, "roles");
module.exports = Role;