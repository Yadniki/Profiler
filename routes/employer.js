var express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

var sess;
// Bring in User Model
let Employer = require('../models/employer');
let User = require('../models/user');
let Profile = require('../models/profile');
// Register Form
router.get('/register', function (req, res) {
    res.render('emp_register');
});

router.post('/register', function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const company = req.body.company;
    const location = req.body.location;
    const contact = req.body.contact;

    let newEmployer = new Employer({
        name: name,
        email: email,
        username: username,
        password: password,
        location: location,
        company: company,
        contact: contact
    });

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newEmployer.password, salt, function (err, hash) {
            if (err)
                console.log(err);
            newEmployer.password = hash;
            newEmployer.save(function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    res.redirect('/');
                }
            });
        });
    });
});

router.get('/login', function (req, res) {
    res.render('emp_login');
});

router.get('/home', function (req, res) {
    sess = req.session;
    if (!sess.emp_id) {
        sess.emp_id = req.user._id;
        console.log('Employer id : ' + sess.emp_id);
    }
    else {
        console.log(' Existing Employer id : ' + sess.emp_id);
    }
    
    res.render('emp_home');
});

router.post('/search', function(req, res){
    var technology = req.body.technology;
    var level = req.body.level;
    console.log(level);
    switch(technology){
        case 'c':
            switch(level){
                case 'high':
                    Profile.find({score_c:{$eq:5}},function(err, result){
                        if (err) {
                            console.log(err);
                            return;
                        }else{
                            console.log(result);
                            var profileArray = result;
                            var userArray = [];
                            if (profileArray.length == 0) {
                                res.render('candidates', { no_users: true });
                            }
                            profileArray.forEach(function (obj) {
                                console.log('user id :' + obj.user_id);
                                User.findOne({ _id: obj.user_id }, function (err, user) {
                                    if (err)
                                        console.log(err);
                                    else {
                                        userArray.push(user);
                                        if (userArray.length == profileArray.length) {
                                            console.log('user array :\n' + userArray);
                                            res.render('candidates', { profile: profileArray, users: userArray });
                                        }
                                    }

                                });

                            });
                        }
                        
                    });
                break;
                case 'mid':
                    Profile.find({score_c:{$gte:3}},function(err, result){
                        if (err) {
                            console.log(err);
                            return;
                        }else{
                            console.log(result);
                            var profileArray = result;
                            var userArray = [];
                            if (profileArray.length == 0) {
                                res.render('candidates', { no_users: true });
                            }
                            profileArray.forEach(function (obj) {
                                console.log('user id :' + obj.user_id);
                                User.findOne({ _id: obj.user_id }, function (err, user) {
                                    if (err)
                                        console.log(err);
                                    else {
                                        userArray.push(user);
                                        if (userArray.length == profileArray.length) {
                                            console.log('user array :\n' + userArray);
                                            res.render('candidates', { profile: profileArray, users: userArray });
                                        }
                                    }

                                });

                            });
                        }
                        
                    });
                break;
                case 'low':
                    Profile.find({score_c:{$gte:0}},function(err, result){
                        if (err){
                            console.log(err);
                            return;
                        }else{
                            console.log(result);
                            var profileArray = result;
                            var userArray = [];
                            if (profileArray.length == 0) {
                                res.render('candidates', { no_users: true });
                            }
                            profileArray.forEach(function (obj) {
                               console.log('user id :'+obj.user_id);
                                User.findOne({_id : obj.user_id}, function (err, user) {
                                    if(err)
                                        console.log(err);
                                    else
                                    {
                                        userArray.push(user);
                                        if (userArray.length == profileArray.length) {
                                            console.log('user array :\n' + userArray);
                                            res.render('candidates',{profile : profileArray,users : userArray});
                                        }
                                    }
                                        
                                }); 
                                
                            });
                            
                            // res.render('candidates',{candidates:result})
                        }
                        
                    });
                break;
            }
        break;
        case 'sql':
            switch(level){
                case 'high':
                    Profile.find({score_sql:{$eq:5}},function(err, result){
                        if (err) {
                            console.log(err);
                            return;
                        }else{
                            console.log(result);
                            var profileArray = result;
                            var userArray = [];
                            if (profileArray.length == 0) {
                                res.render('candidates', { no_users: true });
                            }
                            profileArray.forEach(function (obj) {
                                console.log('user id :' + obj.user_id);
                                User.findOne({ _id: obj.user_id }, function (err, user) {
                                    if (err)
                                        console.log(err);
                                    else {
                                        userArray.push(user);
                                        if (userArray.length == profileArray.length) {
                                            console.log('user array :\n' + userArray);
                                            res.render('candidates', { profile: profileArray, users: userArray });
                                        }
                                    }

                                });

                            });
                        }
                    });
                break;
                case 'mid':
                    Profile.find({score_sql:{$gte:3}},function(err, result){
                        if (err) {
                            console.log(err);
                            return;
                        }else{
                            console.log(result);
                            // res.render('candidates',{candidates:result})
                            var profileArray = result;
                            var userArray = [];
                            if (profileArray.length == 0) {
                                res.render('candidates', { no_users: true });
                            }
                            profileArray.forEach(function (obj) {
                                console.log('user id :' + obj.user_id);
                                User.findOne({ _id: obj.user_id }, function (err, user) {
                                    if (err)
                                        console.log(err);
                                    else {
                                        userArray.push(user);
                                        if (userArray.length == profileArray.length) {
                                            console.log('user array :\n' + userArray);
                                            res.render('candidates', { profile: profileArray, users: userArray });
                                        }
                                    }

                                });

                            });
                        }
                    });
                break;
                case 'low':
                    Profile.find({score_sql:{$gte:0}},function(err, result){
                        if (err){
                            console.log(err);
                            return;
                        }else{
                            console.log(result);
                            // res.render('candidates',{candidates:result})
                            var profileArray = result;
                            var userArray = [];
                            if (profileArray.length == 0) {
                                res.render('candidates', { no_users: true });
                            }
                            profileArray.forEach(function (obj) {
                                console.log('user id :' + obj.user_id);
                                User.findOne({ _id: obj.user_id }, function (err, user) {
                                    if (err)
                                        console.log(err);
                                    else {
                                        userArray.push(user);
                                        if (userArray.length == profileArray.length) {
                                            console.log('user array :\n' + userArray);
                                            res.render('candidates', { profile: profileArray, users: userArray });
                                        }
                                    }

                                });

                            });
                        }
                    });
                break;
            }
        break;
        case 'java':
            switch(level){
                case 'high':
                    Profile.find({score_java:{$eq:5}},function(err, result){
                        if (err) {
                            console.log(err);
                            return;
                        }else{
                            console.log(result);
                            var profileArray = result;
                            var userArray = [];
                            console.log('Length :'+profileArray.length);
                            if(profileArray.length == 0)
                            {
                                res.render('candidates', { no_users: true});
                            }
                            profileArray.forEach(function (obj) {
                                console.log('user id :' + obj.user_id);
                                User.findOne({ _id: obj.user_id }, function (err, user) {
                                    if (err)
                                        console.log(err);
                                    else { 
                                        if(userArray.length == profileArray.length) {
                                            userArray.push(user);
                                            console.log('user array :\n' + userArray);
                                            res.render('candidates', { no_users: false, profile: profileArray, users: userArray });
                                        }
                                    else{
                                        console.log('No profiles found');
                                    }
                                    }

                                });

                            });
                        }
                    });
                break;
                case 'mid':
                    Profile.find({score_java:{$gte:3}},function(err, result){
                        if (err) {
                            console.log(err);
                            return;
                        }else{
                            console.log(result);
                            var profileArray = result;
                            var userArray = [];
                            if (profileArray.length == 0) {
                                res.render('candidates', { no_users: true });
                            }
                            profileArray.forEach(function (obj) {
                                console.log('user id :' + obj.user_id);
                                User.findOne({ _id: obj.user_id }, function (err, user) {
                                    if (err)
                                        console.log(err);
                                    else {
                                        userArray.push(user);
                                        if (userArray.length == profileArray.length) {
                                            console.log('user array :\n' + userArray);
                                            res.render('candidates', { profile: profileArray, users: userArray });
                                        }
                                    }

                                });

                            });
                        }
                    });
                break;
                case 'low':
                    Profile.find({score_java:{$gte:0}},function(err, result){
                        if (err){
                            console.log(err);
                            return;
                        }else{
                            console.log(result);
                            var profileArray = result;
                            var userArray = [];
                            if (profileArray.length == 0) {
                                res.render('candidates', { no_users: true });
                            }
                            profileArray.forEach(function (obj) {
                                console.log('user id :' + obj.user_id);
                                User.findOne({ _id: obj.user_id }, function (err, user) {
                                    if (err)
                                        console.log(err);
                                    else {
                                        userArray.push(user);
                                        if (userArray.length == profileArray.length) {
                                            console.log('user array :\n' + userArray);
                                            res.render('candidates', { profile: profileArray, users: userArray });
                                        }
                                    }

                                });

                            });
                        }
                    });
                break;
            }
        break;
    }
});
// Login Process
router.post('/login', function (req, res, next) {
    passport.authenticate('clientLocal', {
        successRedirect: '/employer/home',
        failureRedirect: '/employer/login'
    })(req, res, next);
});

//email route
router.post('/email', function (req, res, next) {
    console.log('Email is '+ req.body.email);
    res.header("Access-Control-Allow-Origin", "*");
    res.send({ 'message': 'Email sent successfully' });
    const candidateEmail = req.body.email;
    const candidateName = req.body.name;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'rohanpatil365@gmail.com',
            pass: 'Rohan@1927'
        }
    });
    var htmlBody1 = "<h3>Congrtulation , "+candidateName+".</h3>";
    var htmlBody2 = "<p>You have been selected for interview from Profiler.com by <b>"+req.user.name+"</b></p>";
    var htmlBody3 = "<p><b>Email :</b> "+req.user.email+"</p>";
    var htmlBody4 = "<p><b>Contact :</b> " + req.user.contact + "</p>";
    var mailOptions = {
        from: 'rohanpatil365@gmail.com',
        to: candidateEmail,
        subject: 'Profiler :- Selection',
        text: 'You have been selected for interview '+ candidateName,
        html: htmlBody1+htmlBody2+htmlBody3+htmlBody4
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    

});
// logout
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/employer/login');
});


module.exports = router;