const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res){

   try{
      let posts = await Post.find({})
      .sort('-createdAt')   // sorting according to date
      .populate('user')
      .populate({
         path: 'comments',
         populate: {
            path: 'user'
         }
      });
      let users = await User.find({})

      return res.render('home', {
         title: "Codeial | Home",
         posts: posts,
         all_users: users
      });
      
   }catch{
      console.log('Error', err);
      return;
   }
   // console.log(req.cookies);
   // res.cookie('user_id', 25);//editing the cookie value

//    Post.find({}, function(err, posts){
//     return res.render('home', {
//         title: "Codeial | Home",
//         posts: posts
//     });
//    });


   // Post.find({})
   // .populate('user')  // doing this will give the whole user object instead of just user id. This ensures that when you access the user field in each post, it will contain the complete user object instead of just the user ID.
   // .populate({
   //    path: 'comments',
   //    populate: {
   //       path: 'user'
   //    }
   // })
   // .exec(function(err, posts){ // The .exec method is used to execute the query and provide a callback function to handle the results.
      
   //       User.find({},function(err, user){
   //          return res.render('home', {
   //             title: "Codeial | Home",
   //             posts: posts,
   //             all_users: user
   //       });

   //    });
   // });

};