/**
 * UsersController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to UsersController)
     */
    _config: {},

    index: function(req, res) {
        res.view();
    },
    signup: function(req, res) {
    	var username = req.param("username");
    	var password = req.param("password");

    	console.log("username: "+username);
    	console.log("password: "+password);
    	Users.findByUsername(username).done(function(err, usr){
    		if (err){
    			res.send(500, {error: "DB Error"});
    		} else if (usr != ""){
    			res.send(400, {error: "Username already Taken"});
    			console.log("usr: "+usr+"END");
    		} else {
    			// var hasher = require("password-hash");
    			// password = hasher.generate(password);

    			Users.create({username: username, password: password}).done(function(error, user){
    				if (error){
    					res.send(500, {error: "DB Error"});
    				} else {
    					req.session.user = user;
    					res.send(user);
    				}
    			});
    		}
    	});
    },
    login: function(req, res) {
    	var username = req.param("username");
    	var password = req.param("password");

    	console.log("username: "+username);
    	console.log("password: "+password);
    	Users.findByUsername(username).done(function(err, usr){
    		if (err){
    			res.send(500, {error: "DB Error"});
    		} else {
    			if (usr) {
    				console.log("usr:"+usr[0].username+"&passwd:"+usr[0].password);
    				// var hasher = require("password-hash");
    				// if (hasher.verify(password, usr.password)){
    				if (password == usr[0].password){
    					req.session.user = usr;
    					res.send(usr[0]);
    				} else{
    					res.send('Wrong Password', 400);
    				}
    			} else {
    				res.send('User not Found', 404);
    			}
    		}
    	});
    },
    chat: function(req, res) {
    	if (req.session.user) {
    		res.view({username: req.session.user.username});
    	} else {
    		res.redirect('/');
    	}
    }
};