const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/user.controller');

router.get('/not-friend', controller.notfriend);


module.exports = router;