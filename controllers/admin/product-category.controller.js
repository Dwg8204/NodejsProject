const systemConfig = require('../../config/system');
const ProductsCategory = require('../../models/products-category.model');

module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    
    // Phân trang
    let pagination = {
        currentPage: 1,
        limitItem: 4
    };
    
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    
    pagination.skip = (pagination.currentPage - 1) * pagination.limitItem;
    
    // Hàm tạo cây đúng cách
    function createTree(items, parentId = null) {
        const tree = [];
        // Clone để tránh tham chiếu trực tiếp
        const clonedItems = JSON.parse(JSON.stringify(items));
        
        for (const item of clonedItems) {
            const itemParentId = item.parentId ? item.parentId.toString() : null;
            const currentParentId = parentId ? parentId.toString() : null;
            
            if (
                (itemParentId === null && currentParentId === null) || 
                (itemParentId !== null && currentParentId !== null && itemParentId === currentParentId)
            ) {
                // Đảm bảo đệ quy qua tất cả các item
                const children = createTree(items, item._id);
                
                if (children.length > 0) {
                    item.children = children;
                }
                
                tree.push(item);
            }
        }
        
        return tree;
    }
    
    // Lấy tất cả danh mục (không phân trang) để tạo cây đầy đủ
    const allCategories = await ProductsCategory.find(find).sort({position: 1});
    const tree = createTree(allCategories);
    
    // Chỉ lấy các danh mục gốc (level 1) để phân trang
    const rootCategories = tree.slice(
        pagination.skip,
        pagination.skip + pagination.limitItem
    );
    
    // Tính tổng số trang dựa trên số danh mục gốc
    const totalRootCategories = tree.length;
    const totalPage = Math.ceil(totalRootCategories / pagination.limitItem);
    pagination.totalPage = totalPage;
    
    res.render('admin/pages/products-category/index', {
        pageTitle: 'Products Category Management',
        productsCategory: rootCategories,
        pagination: pagination
    });
};

module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };
    function createTree(productsCategory, parentId = null) {
        const tree = [];
        for (let item of productsCategory) {
            const itemParentId = item.parentId ? item.parentId.toString() : null;
            const currentParentId = parentId ? parentId.toString() : null;
            
            if (
                (itemParentId === null && currentParentId === null) || 
                (itemParentId !== null && currentParentId !== null && itemParentId === currentParentId)
            ) {
                let children = createTree(productsCategory, item._id);
                if (children.length) {
                    item.children = children;
                }
                tree.push(item);
            }
        }
        return tree;
    }
    const productsCategory = await ProductsCategory.find(find).sort({position: 1});
    const productsCategoryTree = createTree(productsCategory);
    res.render('admin/pages/products-category/create', {
        pageTitle: 'Create Product Category',
        productsCategory: productsCategoryTree

    });
}


// POST
module.exports.createPost = async (req, res) => {
    if(req.body.position==""){
        const countProducts= await ProductsCategory.countDocuments();;
        req.body.position=countProducts + 1;
    }
    else{
        req.body.position = parseInt(req.body.position);
    }
    if (req.body.parentId === "") {
            req.body.parentId = null;
        }
    const productsCategory = new ProductsCategory(req.body);
    await productsCategory.save();
    res.redirect(systemConfig.PrefixAdmin + '/products-category');
}
