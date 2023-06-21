const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
   },
   function(req, email, password, done){ //done is the callback function which is reporting to passport.js
     // find a user and establish the identity
       User.findOne({email: email}, function(err, user){ //here the first email is the property defined in the Schema under models and second email is the one passed as the argument in the function.
            if(err){
                req.flash('error', err);
                return done(err);
            }

            if(!user || user.password != password){
                req.flash('error', 'Invalid Username/Password');
                return done(null, false); //done has 2 arguments: 1st is for error which is null now i.e. there is no error and 2nd for user which is false i.e. user is not found and authentication is not done.
            }

            return done(null, user);
       }) 
    }
));

// serializing the user to decide which key has to be kept in the cookies and in encrypted form. This is the case when user sign-in for the first time and a cookie is created.
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// deserializing the user from the key in the cookies. This is the case when a new request comes in after the user is signed-in.
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }
        return done(null, user);
    });
});

passport.checkAuthentication = function(req, res, next){
    //if the user is signed in, then pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }

    //if the user is not signed in 
    return res.redirect('/users/sign-in');

}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        //req.user contains the currrent signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;