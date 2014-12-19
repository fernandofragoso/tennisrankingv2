//DEPENDENCIES
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//MODELS
var User = require('../models/user');

//PASSPORT STRATEGY
passport.use(new LocalStrategy({ usernameField:'login',passwordField:'password' },function(login, password, done){
	User.findOne({ $and : [{ login:login },{ password:password }] }, function(err, user){
		if (err) {
			return done(err);
		} 
		if (!user) {
			return done(null, false, { message:"FAILED LOGIN" });
		}
		return done(null, user);
	})
}));

//PASSPORT SERIALIZATION
passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(user, done) {
	done(null, user);
});

//ROUTES
router.get('/', passport.authenticate('local', { successRedirect: '/success',
													   failureRedirect: '/#/login',
													   failureFlash: false }));

router.get('/loggedin', function(req,res){
	res.send(req.isAuthenticated() ? req.user : '0');
});


router.post('/login', passport.authenticate('local', { successRedirect: '/success',
													   failureRedirect: '/#/login',
													   failureFlash: false }));

//RETURN
module.exports = router;