const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const Employer = require('../models/employer');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
    /*
    // Local Strategy
    passport.use(new LocalStrategy(function (username, password, done) {
        // Match Username
        let query = { username: username };
        User.findOne(query, function (err, user) {
            if (err) throw err;
            if (!user) {
                console.log('No user found');
                return done(null, false, { message: 'No user found' });
            }

            // Match Password
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    console.log('Login successful');
                    return done(null, user);
                } else {
                    console.log('wrong password');
                    return done(null, false, { message: 'Wrong password' });
                }
            });
        });
    }));

    

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    */


    passport.use('userLocal', new LocalStrategy(function (username, password, done) {
        // Match Username
        let query = { username: username };
        User.findOne(query, function (err, user) {
            if (err) throw err;
            if (!user) {
                console.log('No user found');
                return done(null, false, { message: 'No user found' });
            }

            // Match Password
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    console.log('Login successful');
                    return done(null, user);
                } else {
                    console.log('wrong password');
                    return done(null, false, { message: 'Wrong password' });
                }
            });
        });
    }));
    passport.use('clientLocal', new LocalStrategy(function (username, password, done) {
        // Match Username
        let query = { username: username };
        Employer.findOne(query, function (err, user) {
            if (err) throw err;
            if (!user) {
                console.log('No user found');
                return done(null, false, { message: 'No user found' });
            }

            // Match Password
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    console.log('Login successful');
                    return done(null, user);
                } else {
                    console.log('wrong password');
                    return done(null, false, { message: 'Wrong password' });
                }
            });
        });
    }));

    // passport.authenticate('userLocal')(req, res, function () {
    //     console.log('user authentication function');
    //     console.log(req.body);
    //     res.redirect('/');
    // });

    // passport.authenticate('clientLocal')(req, res, function () {
    //     console.log('employer authentication function');
    //     console.log(req.body);
    //     res.redirect('/');
    // });

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        if (user != null)
            done(null, user);
    });
}