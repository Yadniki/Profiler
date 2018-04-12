const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
const app = express();
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
var mailer = require('express-mailer');

require('util').inspect.defaultOptions.depth = 4;

mongoose.connect(config.database);
let db = mongoose.connection;

db.once('open',function() {
    console.log('Connected to mongoose...');
})
db.on('error',function(err){
    console.log(err);
})

app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');


// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 180*60*1000}
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//static folder
app.use(express.static(path.join(__dirname, 'public')));

// express maielr middleware
mailer.extend(app, {
    from: 'rohanpatil2708@gmail.com',
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'gmail.rohanpatil2708@gmail.com',
        pass: 'rohan2708'
    }
});
//Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


app.use( function (req, res, next) {
    res.locals.user = req.user || null;
    res.locals.session = req.session;
    // res.locals.login = isAuthenticated();
    
    next();
});

app.get('/',function (req,res){
   res.render('index'); 
//    console.log("User :"+ req.locals.user);
});



let users = require('./routes/users');
app.use('/users', users);

let questions = require('./routes/questions');
app.use('/questions', questions);

let employer = require('./routes/employer');
app.use('/employer',employer);

let admin = require('./routes/admin');
app.use('/admin',admin);

app.listen(3000, function () {
    console.log('Server running on port 3000...');
});