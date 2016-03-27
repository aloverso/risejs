var routes = {};
var util = require('util');
var fs = require('fs');
var mm = require('musicmetadata');
var allsongs = require('../allsongs.json');


routes.home = function(req,res) {
	res.render('home');
}

routes.setup = function(req,res) {
	res.render('setup');
}

routes.getnewsong = function(req,res) {
	// create a new parser from a node ReadStream

	var songslist = allsongs.songs;
	var randi = Math.floor(songslist.length * Math.random());
	var randsong = songslist[randi];
	console.log(randsong);

	var parser = mm(fs.createReadStream('public/audios/Rise Against - '+randsong+'.mp3'), { duration: true }, function (err, metadata) {
	  if (err) throw err;
	  console.log(metadata);
	  console.log(metadata.album);
	  console.log("\n");

	  res.json({
	  	'title':randsong,
	  	'album':metadata.album,
	  	'path':'audios/Rise Against - '+randsong+'.mp3',
	  	'duration':metadata.duration
	  });
	});

	
}

module.exports = routes;