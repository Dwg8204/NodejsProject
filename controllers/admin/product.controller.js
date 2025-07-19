const Product = require('../../models/product.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const systemConfig = require('../../config/system');
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    const filterStatus = filterStatusHelper(req.query);
    const status = req.query.status || '';
    if (status) {
        find.status = status;
    }
    // Tìm kiếm theo từ khóa
    
    const search = searchHelper(req.query);
    const keyword = search.keyword;
    if (keyword) {
        find.title = search.regex;
    }
   
//    Phân trang
    let pagination = {
        currentPage: 1,
        limitItem: 4
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
        
    }
    pagination.skip = (pagination.currentPage - 1) * pagination.limitItem;
    const totalProducts = await Product.countDocuments(find);
    const totalPage = Math.ceil(totalProducts / pagination.limitItem);
    pagination.totalPage = totalPage;
    console.log(totalProducts);
    const products = await Product.find(
            find
        ).sort({ position: 1 }) 
        .limit(pagination.limitItem)
        .skip(pagination.skip);
    res.render('admin/pages/products/index', {
        pageTitle: 'Products Management',
        products: products,
        status: status,
        filterStatus: filterStatus,
        keyword: keyword,
        pagination: pagination
    });
}

module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    const referer = req.get('Referer') || '/admin/products';
    if (!['active', 'inactive'].includes(status)) {
        return res.redirect(referer);

    }
    try {
        await Product.updateOne({ _id: id }, { status: status });
        res.redirect(referer);

    } catch (error) {
        console.error(error);
        res.redirect(referer);
    }
}


module.exports.changeMulti = async (req, res) => {
    console.log(req.body);
    const type = req.body.type;
    let ids = req.body['ids[]'] 
    const referer = req.get('Referer') || '/admin/products';
    console.log("Thay đổi trạng thái các sản phẩm: ", ids, type);
    if (!ids || !type) {
        return res.redirect(referer);
    }
    if (!Array.isArray(ids)) {
        ids = [ids];
    }
    if (!['active', 'inactive'].includes(type)) {
        return res.redirect(referer);
    }
    try {
        await Product.updateMany({ _id: { $in: ids } }, { status: type });
        res.redirect(referer);
    } catch (error) {
        console.error(error);
        res.redirect(referer);
    }
}

module.exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    const referer = req.get('Referer') || '/admin/products';
    
    try {
        // Xoá mềm: cập nhật trạng thái deleted thành true
        await Product.updateOne(
            { _id: id },
            { deleted: true,
                deletedAt: new Date() // Cập nhật thời gian xoá
             }
        );
        res.redirect(referer);
    } catch (error) {
        console.error(`Error deleting product: ${error.message}`);
        res.redirect(referer);
    }
}

module.exports.deleteMulti = async (req, res) => {
    let ids = req.body['ids[]'];
    const referer = req.get('Referer') || '/admin/products';
    
    if (!ids) {
        return res.redirect(referer);
    }
    
    // Nếu chỉ có một sản phẩm được chọn, ids sẽ là string
    if (!Array.isArray(ids)) {
        ids = [ids];
    }
    
    try {
        // Xoá mềm: cập nhật trạng thái deleted thành true
        await Product.updateMany(
            { _id: { $in: ids } },
            { 
                deleted: true,
                deletedAt: new Date() 
            }
        );
        res.redirect(referer);
    } catch (error) {
        console.error(`Error deleting products: ${error.message}`);
        res.redirect(referer);
    }
}

module.exports.changePosition = async (req, res) => {
    const positions = req.body.positions;
    const referer = req.get('Referer') || '/admin/products';
    
    if (!positions) {
        return res.redirect(referer);
    }
    
    try {
        // Phân tích dữ liệu vị trí
        const items = positions.split(',');
        
        for (const item of items) {
            const [id, position] = item.split('-');
            if (id && position) {
                await Product.updateOne(
                    { _id: id },
                    { position: parseInt(position) }
                );
            }
        }
        
        res.redirect(referer);
    }
     catch (error) {
        console.error(`Error changing positions: ${error.message}`);
        res.redirect(referer);
    }
};
// GET
module.exports.create = (req, res) => {
    res.render('admin/pages/products/create', {
        pageTitle: 'Create Product'
    });
}
// POST
module.exports.createPost = async (req, res) => {
    
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if(req.body.position==""){
        const countProducts= await Product.countDocuments();;
        req.body.position=countProducts + 1;
    }
    else{
        req.body.position = parseInt(req.body.position);
    }
    
    const product = new Product(req.body);
    await product.save();
    res.redirect(systemConfig.PrefixAdmin + '/products');
}

// GET
module.exports.edit = async (req, res) => {
    const find = {
            deleted: false,
            _id: req.params.id
        }
    const product = await Product.findOne(find);
    
    res.render('admin/pages/products/edit', {
        pageTitle: 'Edit Product',
        product: product 
    });
}
// POST
module.exports.editPatch = async (req, res) => {
    
   req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    
        req.body.position = parseInt(req.body.position);
    
    if (req.file) {
    req.body.thumbnail = '/uploads/' + req.file.filename;
    }
    try {
        await Product.updateOne(
            { _id: req.params.id },
            req.body
        );
        req.flash('success', 'Cập nhật sản phẩm thành công');
    } catch (error) {
        console.error(`Error updating product: ${error.message}`);
        req.flash('error', 'Cập nhật sản phẩm thất bại');
    }
    res.redirect(req.get('Referer') || systemConfig.PrefixAdmin + '/products');
}

module.exports.detail = async (req, res) => {
    const find = {
        deleted: false,
        _id: req.params.id
    };
    const product = await Product.findOne(find);
    if (!product) {
        return res.status(404).send('Product not found');
    }
    res.render('admin/pages/products/detail', {
        pageTitle: 'Product Detail',
        product: product
    });
}