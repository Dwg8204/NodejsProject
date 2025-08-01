const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/user.controller');

router.get('/not-friend', controller.notfriend);
router.get('/requests', controller.requests);
router.get('/accepts', controller.accepts);

module.exports = router;