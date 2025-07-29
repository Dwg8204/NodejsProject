const express = require('express');
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const multer  = require('multer')
const app = express();
const path = require('path');
// socketIO
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
global._io = io; 


app.use(methodOverride('_method'))
app.use(cookieParser())

app.use(cookieParser('HGLKHGIOG')); // Sử dụng cookieParser đã import
app.use(session({
  secret: 'HGLKHGIOG',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())
const dotenv = require('dotenv').config();
const database = require('./config/database');
database.connect();
const systemConfig = require('./config/system');
const route = require('./routes/client/index.route'); 
const routeAdmin = require('./routes/admin/index.route');
const port = process.env.PORT;
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

// Set up static file serving

app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
    res.locals.message = req.flash();
    next();
});

// tinymce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// app local variables
app.locals.prefixAdmin = systemConfig.PrefixAdmin;

route(app);
routeAdmin(app);

server.listen(port, () => {
    console.log('Example app listening at http://localhost:' + port);
    console.log(
        "admin is" + systemConfig.PrefixAdmin 
    );
})