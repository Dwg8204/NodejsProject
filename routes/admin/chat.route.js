const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/chat.controller');
const chatMiddleware = require('../../middlewares/admin/chat.middleware');
router.get('/:roomChatId', chatMiddleware.isAccess, controller.index);


module.exports = router;