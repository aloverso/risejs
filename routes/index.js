var routes = {};
var util = require('util');
var fs = require('fs');
var mm = require('musicmetadata');
var allsongs = require('../allsongsnew.json');


String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return this.charAt(0) + parseInt(Math.abs(hash));
};

// routes.startgame = function(req,res) {
// 	res.redirect('game');
// }

routes.game = function(req,res) {
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
	res.json({
	  	'title':randsong.title,
	  	'album':randsong.album,
	  	'path':randsong.url,
	  	'duration':randsong.duration
	  });
}

routes.getnsongs = function(req,res) {
	// create a new parser from a node ReadStream

	var n = req.query.n;

	console.log(n);

	var finalsongs = [];
	var songtitles = [];
	var songslist = allsongs.songs;

	for (var i=0; i<n; i++) {
		var index = 1;
		var randsong;
		while (index >= 0) {
			console.log(index);
			var randi = Math.floor(songslist.length * Math.random());
			randsong = makeJson(songslist[randi]);
			index = songtitles.indexOf(randsong.title);
		}
		console.log(index);
		finalsongs.push(randsong);
		songtitles.push(randsong.title);
		// console.log(finalsongs);
	}

	function makeJson(randsong) {
		return {
		  	'title':randsong.title,
		  	'album':randsong.album,
		  	'path':randsong.url,
		  	'duration':randsong.duration,
		  	'startTime':Math.floor((randsong.duration-25) * Math.random()),
		  	'guess':false
		  };
	}

	res.json(finalsongs);
}

routes.getConfig = function(req, res) {
	// res.json(config);
}

routes.reset = function(req, res) {
	config = defaultconfig;
	res.json(config);
}

routes.updateConfig = function(req, res) {
	// var p = {};
	// for (var key in req.body) {
	//     p[key] = parseInt(req.body[key]);
	// }
	// config=p;
}

	// var parser = mm(fs.createReadStream('public/audios/ra'+randsong.hashCode()+'.mp3'), { duration: true }, function (err, metadata) {
	//   if (err) throw err;
	//   console.log(metadata);
	//   console.log(metadata.album);
	//   console.log("\n");

	//   res.json({
	//   	'title':randsong,
	//   	'album':metadata.album,
	//   	'path':'audios/ra'+randsong.hashCode()+'.mp3',
	//   	'duration':metadata.duration
	//   });
	// });

	

module.exports = routes;