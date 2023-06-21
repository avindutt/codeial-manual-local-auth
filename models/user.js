const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path'); // this will change the string describing path into real path (the location where AVATAR file will be stored)
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type:  String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {  // this avatar corresponds to file.fieldname. This avatar attribute is the name of the field in the form.
        type: String 
    }
}, {
    timestamps: true
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  });

  // static function
userSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar'); // only single file will be uploaded at a time
userSchema.statics.avatarPath = AVATAR_PATH; // making AVATAR_Path publically available

const User = mongoose.model('User', userSchema);
module.exports = User;