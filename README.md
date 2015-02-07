### The Antisocial Network

This is a node.js based "Wall" or reverse chronilogical feed for an individual user. I orginally created it to be run locally with the following modules and dependencies so that I could post all the possible content that might be suitable for a social media context, without the social validation.

The stack dependencies are:
* [Mongo DB](https://github.com/mongodb/mongo "Mongo DB")
* [Node.js](http://nodejs.org/ "Node.js")
* [Express](http://expressjs.com/ "Express") - [Github](https://github.com/strongloop/expressjs.com "Express Js Github")
**    $ npm install express
* [Jade](http://jade-lang.com/ "Jade") Node Template Engine [Github](https://github.com/jadejs/jade "Jade Github")
**    $ npm install jade
* [Socket.io](http://socket.io/ "Socket.io") - [Github](https://github.com/Automattic/socket.io/ "Socket Github")
**    $ npm install socket.io
* [MongoJS](https://github.com/mafintosh/mongojs)
**    $ npm install mongojs

You will need to add update line 5, 8, and 11. To link to your mongoDB and proper collection. You will need to also add your ipaddress.

	5 var db = require('mongojs').connect("Mongo_DB_Database", ['Mongo_DB_Collection']);
	6 
	7 // Add IP enviroment
	8 var ipaddr  = 
	9 var Autolinker = require( 'autolinker' );
	10 
	11 var posts = db.collection('Mongo_JS_Collection');