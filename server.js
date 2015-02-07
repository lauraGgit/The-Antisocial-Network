#!/bin/env node

var express = require('express');
var fs      = require('fs');
var db = require('mongojs').connect("Mongo_DB_Database", ['Mongo_DB_Collection']);

// Add IP enviroment
var ipaddr  = 
var Autolinker = require( 'autolinker' );

var posts = db.collection('Mongo_JS_Collection');

var app = express();
var port = 4500;

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");

//
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){

    res.render("page");
});

app.use(express.static(__dirname + '/public'));
app.use(express.favicon("public/favicon.ico"));
var io = require('socket.io').listen(app.listen(port, ipaddr));
io.sockets.on('connection', function (socket) {
retPosts = {};

	//Send Old Posts
	posts.find().limit(10).sort({date:-1},function(err,docs){
	if (err) throw err;
	if (docs) {
		//doc.post = Autolinker.link( doc.post, { className: "myLink", stripPrefix:true } );
		socket.emit('load post', docs);
	}
	});

	//Get older posts
	socket.on('get older posts', function(skipNum){
		posts.find().limit(10).skip(skipNum).sort({date:-1},function(err,docs){
		if (err) throw err;
		if (docs) {
			//doc.post = Autolinker.link( doc.post, { className: "myLink", stripPrefix:true } );
			socket.emit('load post', docs);
		}
		});

	});

	//Add new posts
	socket.on('add post', function(data){
		posts.save({post: data.post, date: data.date}, function(){
	
			//success
			socket.emit('post updated', 'new post added');
		});
	});

	//Update Posts
	socket.on('update post', function(data){
		db.posts.update({"date": data.ind},{'$set' : {post: data.post, updated: data.updated}}, function(){
			//success
			socket.emit('post updated', 'old post updated');
		});
	});
});



