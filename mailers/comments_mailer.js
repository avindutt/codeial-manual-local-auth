const nodemailer = require('../config/nodemailer');

exports.newComment = (comment) => {

    nodemailer.transporter.sendMail({
        from: 'avindutt2369@gmail.com',
        to: comment.user.email,
        subject: "New Comment on Post",
        html: '<h1>Yup, your comment added</h1>'
    }, (err, info) => {
        if(err){console.log('Error in sending mail', err); return}
        console.log('Message sent', info);
        return;
    });
};