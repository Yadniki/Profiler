const mongoose = require('mongoose');

var Question = new mongoose.Schema({
    title: String,
    option_a: String,
    option_b: String,
    option_c: String,
    option_d: String,
    answer: String,
    difficulty: String
});

module.exports = mongoose.model('sql_question', Question);