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

function Container(ns, sl, aa) {

	var currentSong;
	var songs = [];
	var counter = 0;
	var start = true;
	var notplaying = true;
	var timesecs = 0;
	var score = 0;
	var songlen = sl;
	var numsongs = ns;
	var albumart = aa;

	var timerint;
	var songcheckint;

	var loads = [];

	var canplay = [];
	var songsplay = [];

	this.setgame = setgame;
	this.newgame = newgame;
	this.playpause = playpause;
	this.nextsong = nextsong;
	this.backsong = backsong;
	this.jumpsong = jumpsong;
	this.checkGuess = checkGuess;

	var alpha = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

	function setgame() {
		for (var i=0; i<numsongs; i++) {
			$.get("getnewsong")
			.done(function(data) {
				
				data.startTime = Math.floor((data.duration-15) * Math.random());
				data.guess = false;
				if (songs.indexOf(data)<0) {
					songs.push(data);
					console.log('hella');
				}
				else {
					$.get("getnewsong")
					.done(function(data) {
						
						data.startTime = Math.floor((data.duration-15) * Math.random());
						data.guess = false;
						if (songs.indexOf(data)<0) {
							songs.push(data);
						}
						else {
							$.get("getnewsong")
							.done(function(data) {
								
								data.startTime = Math.floor((data.duration-15) * Math.random());
								data.guess = false;
								if (songs.indexOf(data)<0) {
									songs.push(data);
								}
								else {
									throw ('Randomness Error: Please Reload');
								}
						});
					}
				});
			}
		});
			
		}

		songcheckint = setInterval(function() {
			if (currentSong) {
				if (canplay[counter].currentTime >= currentSong.startTime + songlen) {
					canplay[counter].currentTime = currentSong.startTime;
				}
			}

				// first time
				//**********************
				if ((start || notplaying) && songs.length == numsongs) {

					if (start) {
						console.log("FUCK");
						for (var i=0; i<numsongs; i++) {
							var audioElement = document.createElement('audio');
							audioElement.setAttribute('src', songs[i].path);
							audioElement.currentTime = songs[i].startTime;
							audioElement.load();
							audioElement.setAttribute('id',songs[i].title)
							audioElement.preload = "auto";
							console.log(audioElement);
							audioElement.added = false;
							audioElement.oncanplaythrough = function() {
								if (canplay.indexOf(this) < 0 && !this.added) {
									console.log("woott");
									canplay.push(this);
									console.log("woottt");
									t = this.getAttribute('id');
									console.log("woot"+t);
									for (var j=0; j<numsongs; j++) {
										if (songs[j].title === t) {
											songsplay.push(songs[j]);
											console.log("woot2"+t);
											break;
										}
									}
									console.log("woot3"+t);
									$('#loading').remove();
									$('#status').append("<div class='status-box clickable' id='"+t.hashCode()+"' onclick='c.jumpsong("+(canplay.indexOf(this))+")'>"+(canplay.indexOf(this)+1)+"</div>");
									if (canplay.length < numsongs) {
										$('#status').append("<div id='loading'>LOADING...</div>");
									}
									this.added = true;

								}
							}
							loads.push(audioElement);
						}
						start = false;
					}

					if (canplay.length > 0) {
						console.log(canplay);
						currentSong = songsplay[0];
						canplay[0].currentTime = currentSong.startTime;
						if(albumart) {
							$('#albumart').attr('src', 'images/'+currentSong.album+'.jpg');
						} else {
							$('#albumart').attr('src', 'images/noart.jpg');
						}
						$('#'+currentSong.title.hashCode()).css('border', '3px solid #333');
						canplay[0].play();
						notplaying = false;
					}

				}
		}, 500);

		timerint = setInterval(function() {
			timesecs += 1;
			$('#timer').html("Time: "+formatSecString(timesecs));
		}, 1000);



	}

	function playpause() {
		if (canplay[counter].paused) {
			canplay[counter].play();
			$('#playpauser').attr('class', 'fa fa-pause-circle-o fa-5x clickable');
		}
		else {
			canplay[counter].pause();
			$('#playpauser').attr('class', 'fa fa-play-circle-o fa-5x clickable');
		}
	}

	function pausesong() {
		canplay[counter].pause();
	}

	function nextsong() {
		canplay[counter].pause();
		if (counter < canplay.length -1) {
			counter = counter + 1;
			updatesong();
		}
	}

	function backsong() {
		canplay[counter].pause();
		if (counter > 0) {
			counter = counter - 1;
			updatesong();
		}
	}

	function jumpsong(i) {
		canplay[counter].pause();
		counter = i;
		updatesong();
	}

	function updatesong() {
		song = songsplay[counter];

		$('#'+currentSong.title.hashCode()).css('border', '0px solid #333');
		currentSong = song;
		$('#'+currentSong.title.hashCode()).css('border', '3px solid #333');
		if (albumart) {
			$('#albumart').attr('src', '');
		}
	
		canplay[counter].currentTime = currentSong.startTime;
		canplay[counter].play();
		if (albumart) {
			$('#albumart').attr('src', 'images/'+currentSong.album+'.jpg');
		}
		$('#playpauser').attr('class', 'fa fa-pause-circle-o fa-5x');
	}

	function newgame() {
		location.reload();
	}

	function formatSecString(secs) {
	    var mins = Math.floor(secs/60);
	    var se = Math.floor(secs % 60);
	    return mins+"m"+se+"s";
	}

	function strip(s) {
		return s.toLowerCase().replace(/['.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
	}

	function checkGuess(guess) {
		if (!currentSong.guess) {
			currentSong.guess = true;

			if (strip(guess) === strip(currentSong.title)) {
				score += 1;
				$('#score').html("Score: "+score);
				$('#'+currentSong.title.hashCode()).html("<i class='fa fa-check-circle'></i> "+currentSong.title);
				$('#'+currentSong.title.hashCode()).css('background', '#00eb34');
				nextsong();
			}
			else {
				$('#'+currentSong.title.hashCode()).html("<i class='fa fa-times-circle'></i> "+currentSong.title);
				$('#'+currentSong.title.hashCode()).css('background', '#fe2c3b');
				nextsong();
			}
		}
	}
}

var c;
var CONFIG;

$.get('/getConfig').done(function(data) {
	CONFIG = data;
	console.log(typeof(CONFIG.gameplay));

	// FIXED NUMBER OF SONGS
	if (!CONFIG.gameplay) {
		console.log('waht');
		c = new Container(CONFIG.numsongs, CONFIG.songlen, CONFIG.albumart);

		c.setgame();
		console.log(c);
	}
});

var $guessForm = $('form.guessform').unbind();

function submitGuess() {
	event.preventDefault();
	var guess = $('#guess').val();
	$('#guess').val('');
	
	c.checkGuess(guess);
	return false;
};

function restart() {
	$(location).attr('href', '/')
}

