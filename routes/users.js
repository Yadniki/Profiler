const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const randomQuery = require('mongoose-query-random');
var sess;
// Bring in User Model
let User = require('../models/user');
let Profile = require('../models/profile');

// Register Form
router.get('/register', function (req, res) {
    res.render('register');
});

router.post('/register',function(req,res){
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const edu = req.body.qualification;
    const dob = req.body.dob;

    let newUser = new User({
        name:name,
        email:email,
        username:username,
        password:password,
        education:edu,
        dob:dob
    });

    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(newUser.password,salt,function(err,hash){
            if (err)
                console.log(err);
            newUser.password = hash;
            newUser.save(function(err){
                if(err)
                {
                    console.log(err);
                    return;
                }
                else{
                    let newProfile = new Profile({
                        score_c : 0,
                        score_sql : 0,
                        score_java: 0,
                        user_id : newUser._id
                    });
                    newProfile.save(function(err){
                        if (err){
                            console.log("err in creating profile");
                            return;
                        }else{
                            res.redirect('/');
                        }
                    });        
                }
            });
        });
    });
});

router.get('/login', function (req, res) {
    res.render('login');
});

router.get('/home',function (req,res){
    sess = req.session;
    var myvar;
    //if (req.user._id == '5abb545b4812810a28df890d')
    if (req.user.username == 'Admin')
    {
        res.render('admin_home');
        return;
    }
    if(!sess.user_id)
    {
        sess.user_id = req.user._id;
        myvar = req.user._id;
        console.log('User_id : '+sess.user_id);
    }
    else{
        console.log(' Existing User_id : ' + sess.user_id);
    }
        
    // if(req.user._id)
    //     console.log(req.user._id);
    res.render('user_home');
});

// Login Process
router.post('/login', function (req, res, next) {
    passport.authenticate('userLocal', {
        successRedirect: '/users/home',
        failureRedirect: '/users/login'
        // failureFlash: true
    })(req, res, next);
});


// logout
router.get('/logout', function (req, res) {
    req.logout();
    // req.flash('success', 'You are logged out');
    res.redirect('/users/login');
});
//grade result
router.post('/quiz/result', function (req, res) {
    //console.log(JSON.stringify(req.body));
    var keys = [];
    var values = [];
    var userAnswers = {};
    for (var key in req.body) {
        keys.push(key);
        values.push(req.body[key]);
    }
    console.log(keys[0]); //which quiz was attempted c, sql, java
    var type = keys[0];
    keys.shift(); values.shift(); //removing first element i.e model name
    console.log(keys);
    console.log(values);

    for (var x = 0; x < keys.length; x++) {
        userAnswers['' + keys[x]] = values[x];
    }
    console.log(userAnswers);

    switch (type) {
        case "c":
            //console.log("we are in switch c");
            var AnswerModel = require('../models/cQuestion.js');
            var finalAnswers = {};
            var finalAnswersID = [];
            var x = 0;
            var counter = [];
            keys.forEach(function (quest_id) {
                AnswerModel.find({ _id: quest_id }, function (err, questions) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        questions.forEach(element => {
                            //finalAnswers.push(element.answer);
                            //finalAnswersID.push(element._id);
                            finalAnswers['' + element._id] = '' + element.answer;
                        });
                        counter.push(true);
                        if (counter.length === keys.length) {
                            console.log('All done');
                            var correctans = 0;
                            console.log(finalAnswers);
                            for (quest_id in finalAnswers) {
                                var myAns = userAnswers[quest_id];
                                var actualAns = finalAnswers[quest_id];
                                console.log("my ans was " + myAns);
                                console.log("correct ans was " + actualAns);
                                if (myAns === actualAns)
                                    correctans++;
                            }
                            console.log("No of correct " + correctans);
                            console.log(req.user._id);
                            const doc = {
                                score_c: correctans
                            }
                            Profile.update({ user_id: req.user._id }, doc, function (err, raw) {
                                if (err) {
                                    console.log("error in storing ans in profile");
                                }
                                else {
                                    console.log("check for updated c score");
                                    //res.redirect not working
                                    // res.redirect('/users/home');
                                    res.header("Access-Control-Allow-Origin", "*");
                                    res.send({ 'message': 'Quiz evaluation done successfully' });
                                    return;
                                }
                            });
                        }
                    }
                });
            });
            break;
        case "sql":
            //console.log("we are in switch sql");
            var AnswerModel = require('../models/sqlQuestion.js');
            var finalAnswers = {};
            var finalAnswersID = [];
            var x = 0;
            var counter = [];
            keys.forEach(function (quest_id) {
                AnswerModel.find({ _id: quest_id }, function (err, questions) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        questions.forEach(element => {
                            //finalAnswers.push(element.answer);
                            //finalAnswersID.push(element._id);
                            finalAnswers['' + element._id] = '' + element.answer;
                        });
                        counter.push(true);
                        if (counter.length === keys.length) {
                            console.log('All done');
                            var correctans = 0;
                            console.log(finalAnswers);
                            for (quest_id in finalAnswers) {
                                var myAns = userAnswers[quest_id];
                                var actualAns = finalAnswers[quest_id];
                                console.log("my ans was " + myAns);
                                console.log("correct ans was " + actualAns);
                                if (myAns === actualAns)
                                    correctans++;
                            }
                            console.log("No of correct " + correctans);
                            console.log(req.user._id);
                            const doc = {
                                score_sql: correctans
                            }
                            Profile.update({ user_id: req.user._id }, doc, function (err, raw) {
                                if (err) {
                                    console.log("error in storing ans in profile");
                                }
                                else {
                                    console.log("check for updated sql score");
                                    //res.redirect not working
                                    // res.redirect('/users/home');
                                    res.header("Access-Control-Allow-Origin", "*");
                                    res.send({ 'message': 'Quiz evaluation done successfully' });
                                    return;
                                }
                            });
                        }
                    }
                });
            });
            break;
        case "java":
            //console.log("we are in switch java");
            var AnswerModel = require('../models/javaQuestion.js');
            var finalAnswers = {};
            var finalAnswersID = [];
            var x = 0;
            var counter = [];
            keys.forEach(function (quest_id) {
                AnswerModel.find({ _id: quest_id }, function (err, questions) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        questions.forEach(element => {
                            //finalAnswers.push(element.answer);
                            //finalAnswersID.push(element._id);
                            finalAnswers['' + element._id] = '' + element.answer;
                        });
                        counter.push(true);
                        if (counter.length === keys.length) {
                            console.log('All done');
                            var correctans = 0;
                            console.log(finalAnswers);
                            for (quest_id in finalAnswers) {
                                var myAns = userAnswers[quest_id];
                                var actualAns = finalAnswers[quest_id];
                                console.log("my ans was " + myAns);
                                console.log("correct ans was " + actualAns);
                                if (myAns === actualAns)
                                    correctans++;
                            }
                            console.log("No of correct " + correctans);
                            console.log(req.user._id);
                            const doc = {
                                score_java: correctans
                            }
                            Profile.update({ user_id: req.user._id }, doc, function (err, raw) {
                                if (err) {
                                    console.log("error in storing ans in profile");
                                }
                                else {
                                    console.log("check for updated java score");
                                    //res.redirect not working
                                    // res.redirect('/users/home');
                                    res.header("Access-Control-Allow-Origin", "*");
                                    res.send({ 'message': 'Quiz evaluation done successfully' });
                                    return;
                                }
                            });
                        }
                    }
                });
            });
            break;
    }


    //console.log("we are not in switch c");
});
//generate quiz
router.get('/quiz/:type',function(req,res){
    let type = req.params.type;
    console.log(type);
    var finish1=false,finish2=false,finish3=false;
    switch(type){
        case "c":
            var QuestionModel = require('../models/cQuestion.js');
            var finalResult = [];
            var typeArray = ['low', 'mid', 'high'];
            var counter = [];
            typeArray.forEach(function (name) {
                var n;
                if(name == 'low')
                    n = 1;
                else
                    n = 2;
                QuestionModel.find().where('difficulty').equals(name).random(n, true, function (err, questions) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(questions.length);
                        questions.forEach(element => {
                            finalResult.push(element);
                        });
                        counter.push(true);
                        if(counter.length === typeArray.length)
                        {
                            console.log(JSON.stringify(finalResult));
                            // console.log(req.user._id);
                            res.render('quiz',{questions:finalResult, type:type});
                        }
                    }
                });
            });
        break;
        case "sql":
            var QuestionModel = require('../models/sqlQuestion.js');
            var finalResult = [];
            var typeArray = ['low', 'mid', 'high'];
            var counter = [];
            typeArray.forEach(function (name) {
                var n;
                if (name == 'low')
                    n = 1;
                else
                    n = 2;
                QuestionModel.find().where('difficulty').equals(name).random(n, true, function (err, questions) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        questions.forEach(element => {
                            finalResult.push(element);
                        });
                        counter.push(true);
                        if (counter.length === typeArray.length) {
                            res.render('quiz', { questions: finalResult, type: type });
                        }
                    }
                });
            });
        break;
        case "java":
            var QuestionModel = require('../models/javaQuestion.js');
            var finalResult = [];
            var typeArray = ['low', 'mid', 'high'];
            var counter = [];
            typeArray.forEach(function (name) {
                var n;
                if (name == 'low')
                    n = 1;
                else
                    n = 2;
                QuestionModel.find().where('difficulty').equals(name).random(n, true, function (err, questions) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        questions.forEach(element => {
                            finalResult.push(element);
                        });
                        counter.push(true);
                        if (counter.length === typeArray.length) {
                            // console.log('All done');
                            // console.log(JSON.stringify(finalResult));
                            res.render('quiz', { questions: finalResult, type: type });
                        }
                    }
                });
            });
        break;
    }
});
//show profile
router.get('/myprofile', function (req, res) {
    //req.logout();
    // req.flash('success', 'You are logged out');
    Profile.find({user_id: req.user._id}, function(err, profile){
        if(err){
            console.log(err); return;
        }else{
            res.render('profile',{profile : profile});
        }
    });
    //res.redirect('/users/login');
});

module.exports = router;