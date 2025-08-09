const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/rooms-chat.controller');
const chatMiddleware = require('../../middlewares/admin/chat.middleware');
router.get('/', controller.index);


module.exports = router;