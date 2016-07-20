var routes = {};
var util = require('util');
var fs = require('fs');
var mm = require('musicmetadata');
var allsongs = require('../allsongsnew.json');
var Entry = require('./../models/entryModel.js');

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
	// console.log(randsong);
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

	// console.log(n);

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
		// console.log(index);
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

routes.saveEntry = function(req, res) {
	var entry = {};

	entry.name = req.body.name;
	entry.contest = req.body.contest;
	entry.score = req.body.score;
	entry.timesecs = req.body.timesecs;

  	var entryToSave = new Entry(entry);

	entryToSave.save(function(err) {
		if (err) {console.log('err:', err);}
		else {
			console.log(entryToSave._id);
			
			Entry.find({'contest':entry.contest})
			  .exec(function(err, entries) {
			  	
			  	entries.sort(function(a, b) {
			  		if (a.score > b.score) return -1;
			  		else if (a.score < b.score) return 1;

			  		if (a.timesecs > b.timesecs) return 1;
			  		else if (a.timesecs < b.timesecs) return -1;
			  		else return 0;
				});
			  	var place = -1;
			  	var len = entries.length;
			  	for (var i=0; i<len; i++) {
			  		console.log(entries[i]._id, entryToSave._id);
			  		if (entries[i]._id.toString() === entryToSave._id.toString()) {
			  			place = i;
			  			break;
			  		}
			  	}
			  	res.json({'place': place+1, 'total':len})
			});
		}
	});
}

routes.getEntries = function(req, res) {
	console.log(req.query.contest);
	Entry.find({'contest':req.query.contest})
	  .exec(function(err, entries) {
	  	console.log(entries);

	  	// sort first by score - higher scores come first
	  	// then by time -less time taken come first
	  	// then by date - newer entries first for more churn
	  	entries.sort(function(a, b) {
	  		if (a.score > b.score) return -1;
	  		else if (a.score < b.score) return 1;

	  		if (a.timesecs > b.timesecs) return 1;
	  		else if (a.timesecs < b.timesecs) return -1;
	  		
	  		// with ids, greater is newer
	  		if (a._id > b._id) return -1;
	  		else if (a._id < b._id) return 1;
	  		else return 0;
		});
	  	if (entries.length < req.query.number) {
	    	res.json(entries);
	    } else {
	    	res.json(entries.slice(0,req.query.number));
	    }
	  });
}
	

module.exports = routes;