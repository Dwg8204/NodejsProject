const systemConfig = require('../../config/system')

const dashboardRoutes = require('./dashboard.route');
const testRoutes = require('./test.route'); 
const productRoutes = require('./product.route');
const productCategoryRoutes = require('./products-category.route');
const roleRoutes = require('./role.route');

module.exports = (app) => {
    app.use(systemConfig.PrefixAdmin + "/dashboard", dashboardRoutes);
    app.use(systemConfig.PrefixAdmin + "/test", testRoutes); 
    app.use(systemConfig.PrefixAdmin + "/products", productRoutes);
    app.use(systemConfig.PrefixAdmin + "/products-category", productCategoryRoutes);
    app.use(systemConfig.PrefixAdmin + "/roles", roleRoutes);

}