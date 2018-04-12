const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


router.get('/register', function (req, res) {
    res.render('admin_home');
});

module.exports = router;