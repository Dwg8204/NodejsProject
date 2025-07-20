const express = require('express');
const multer = require('multer')

const router = express.Router();
const controller = require('../../controllers/admin/product-category.controller');
const upload = multer();

const validate = require('../../validates/admin/products-category.validate');
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');
const uploadMiddleware = uploadCloud.upload;
router.get('/', controller.index);

router.get('/create', controller.create); 
router.post('/create',
    upload.single('thumbnail'),
    uploadMiddleware,
    validate.createPost,
    controller.createPost
);

module.exports = router;