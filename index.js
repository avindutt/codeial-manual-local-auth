const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

//const { connect } = require('mongoose');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');


app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));

app.use('/uploads', express.static(__dirname + '/uploads')); // telling the app to use uploads folder

app.use(expressLayouts);

//extract style and scripts from sub pages(user_profile) into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


//setting up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    secret: 'something',
    saveUninitialized: false, // when identity is established then we don not want to save the session data in browser
    resave: false, // when identity is established we do not want to save the data again and again if it is not changed
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
        mongoUrl: 'mongodb://0.0.0.0/codeial_development',
        autoRemove: 'disabled'
    },
    function(err){
        console.log(err || 'connect-mongodb setup ok');
    }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash()); // for notifications ( to be placed just after session)
app.use(customMware.setFlash);
// use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
    console.log(`Error in running the server: ${err}`); // this is called interpolation
    }
    console.log('Server is running on the port', port);
});