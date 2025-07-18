const systemConfig = require('../../config/system')

const dashboardRoutes = require('./dashboard.route');
const testRoutes = require('./test.route'); // Thêm dòng này
const productRoutes = require('./product.route');

module.exports = (app) => {
    app.use(systemConfig.PrefixAdmin + "/dashboard", dashboardRoutes);
    app.use(systemConfig.PrefixAdmin + "/test", testRoutes); 
    app.use(systemConfig.PrefixAdmin + "/products", productRoutes);

}