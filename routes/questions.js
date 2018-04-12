const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Register Form
router.get('/add',ensureAuthenticated, function (req, res) {
    res.render('question_add');
});

router.post('/add',function (req,res){
    // console.log(req.body);
    const title = req.body.title;
    const technology = req.body.technology;
    const option_a = req.body.option_a;
    const option_b = req.body.option_b;
    const option_c = req.body.option_c;
    const option_d = req.body.option_d;
    const answer = req.body.answer;
    const difficulty = req.body.difficulty;

    if(technology === "c")
    {
        let question = require('../models/cQuestion');
        let newQuestion = new question({
            title: title,
            option_a: option_a,
            option_b: option_b,
            option_c: option_c,
            option_d: option_d,
            answer: answer,
            difficulty: difficulty
        });
        newQuestion.save(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect('/questions/add');
            }
        });
    }
    else if(technology === "sql")
    {
        let question = require('../models/sqlQuestion');
        let newQuestion = new question({
            title: title,
            option_a: option_a,
            option_b: option_b,
            option_c: option_c,
            option_d: option_d,
            answer: answer,
            difficulty: difficulty
        });
        newQuestion.save(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect('/questions/add');
            }
        });
    }
    else if(technology === "java")
    {
        let question = require('../models/javaQuestion');
        let newQuestion = new question({
            title: title,
            option_a: option_a,
            option_b: option_b,
            option_c: option_c,
            option_d: option_d,
            answer: answer,
            difficulty: difficulty
        });
        newQuestion.save(function(err){
            if(err){
                console.log(err);
            }
            else{
                res.redirect('/questions/add');
            }
        });
    }
        
        
    });

// Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        // req.flash('danger', 'Please login');
        console.log('Please login....');
        res.redirect('/users/login');
    }
}
module.exports = router;
