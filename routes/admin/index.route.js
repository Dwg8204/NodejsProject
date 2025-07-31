const systemConfig = require('../../config/system')
const middlewareAuth = require('../../middlewares/admin/auth.middleware');
const dashboardRoutes = require('./dashboard.route');
const testRoutes = require('./test.route'); 
const productRoutes = require('./product.route');
const productCategoryRoutes = require('./products-category.route');
const roleRoutes = require('./role.route');
const accountRoutes = require('./account.route');
const authRoutes = require('./auth.route');
const myAccountRoutes = require('./my-account.route');
const chatRoutes = require('./chat.route');
const userRoutes = require('./user.route');

const authController = require('../../controllers/admin/auth.controller');

module.exports = (app) => {
    app.use(systemConfig.PrefixAdmin + "/dashboard", middlewareAuth.requireAuth, dashboardRoutes);
    app.use(systemConfig.PrefixAdmin + "/test", middlewareAuth.requireAuth, testRoutes); 
    app.use(systemConfig.PrefixAdmin + "/products", middlewareAuth.requireAuth, productRoutes);
    app.use(systemConfig.PrefixAdmin + "/products-category", middlewareAuth.requireAuth, productCategoryRoutes);
    app.use(systemConfig.PrefixAdmin + "/roles", middlewareAuth.requireAuth, roleRoutes);
    app.use(systemConfig.PrefixAdmin + "/accounts", middlewareAuth.requireAuth, accountRoutes);
    app.use(systemConfig.PrefixAdmin + "/auth", authRoutes);
    app.use(systemConfig.PrefixAdmin + "/my-account", middlewareAuth.requireAuth, myAccountRoutes);
    app.use(systemConfig.PrefixAdmin + "/chat", middlewareAuth.requireAuth, chatRoutes);
    app.get(systemConfig.PrefixAdmin , authController.login);
    app.use(systemConfig.PrefixAdmin + "/user", middlewareAuth.requireAuth, userRoutes);

}