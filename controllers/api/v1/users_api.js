const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession = async function(req, res){
    try{
        let user = await User.findOne({email: req.body.email});

        if (!user || user.password != req.body.password){
            return res.json(422, {
                message: 'Invalid username/password'
            })
        }

        return res.json(200, {
            message: 'Sign in successful, here is your token, please keep it safe',
            data: {
                token: jwt.sign(user.toJSON(), 'codeial', {expiresIn: '1000000'}) // user.toJSON() this part is encrypted in header and codeial key is used to do it so it is passed here
            }
        })

    }catch(err){
        console.log('*******', err);
        return res.json(500, {
            message: "Internal server error"
        })
    }
}
