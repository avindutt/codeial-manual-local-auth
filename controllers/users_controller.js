//this controller will be able to control many users

const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
 0   });
}

// module.exports.profile = function(req, res){
//     if(req.cookies.user_id){
//         User.findById(req.cookies.user_id, function(err, user){
//             if(user){
//                 return res.render('user_profile', {
//                     title: "User Profile",
//                     user: user //sending user to the user_profile page
//                 })
//             }
//             return res.redirect('/users/sign-in');
//         });
//     }else{
//         return res.redirect('/users/sign-in');
//     }
// };

module.exports.update = async function(req, res) {

    if(req.user.id == req.params.id){

        try{

            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){console.log('****multer error',err)};

                user.name = req.body.name;
                user.email = req.body.email;  // this wouldn't have been possible without the above multer function as we cannot access multipart form body without it.

                if (req.file){

                    if (user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                    // this is saving the path of uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename
                }
                user.save();
                return res.redirect('back')
            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    } else {
        return res.status(401).send('Unauthorized');
    }
    // if(req.user.id == req.params.id){ // putting a check if any other logged in user doesn't changes html with developer tools
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //         return res.redirect('back');
    //     });
    // }else{
    //     return res.status(401).send('Unauthorized');
    // }
}

//render the signUp page
module.exports.signUp = function(req, res){
    //not showing the sign-in and sign-up pages when the user is logged in
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
};

//render the signIn page
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
};

//get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('Error in creating user while signing up'); return}

        if(!user){
            User.create(req.body, function(err, user){
                if(err){console.log('Error in creating user while signing up'); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }
    })   
}

//sign in and create the session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully')
    return res.redirect('/');
};

// module.exports.createSession = function(req, res){
//     //steps to authenticate
//     //finding the user
//     User.findOne({email: req.body.email}, function(err, user){
//         if(err){console.log('Error in creating user while signing up'); return}
//         //handle the user found
//         if(user){

//             //handle if password doesn't match
//             if(user.password != req.body.password){
//                 return res.redirect('back');
//             }
//             //handle session creation
//             res.cookie('user_id', user.id);
//             return res.redirect('/users/profile');

//         }else{
//         //handle user not found
//         return res.redirect('back');
//         }
//     });
    
// }


module.exports.destroySession = function(req, res, next){
    req.logout(function(err){
        if(err){next(err);}
        req.flash('success', 'You have logged out!')

        return res.redirect('/');
    });
}