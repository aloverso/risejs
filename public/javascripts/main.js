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

var defaultconfig = {
	"gameplay": 1,
    "songlen": 10,
    "numsongs": 10,
    "albumart": 1,
    "playtime":180
};

var CONFIG = {
	"gameplay": 1,
    "songlen": 10,
    "numsongs": 10,
    "albumart": 1,
    "playtime":180
};

function getNumSongs() {
	return CONFIG.numsongs;
}

function Container() {

	var currentSong;
	var songs = []; // contains loading song objects
	var counter = 0;
	var start = true;
	var notplaying = true;
	var timesecs = CONFIG.playtime;
	var score = 0;
	var ended = false;

	var timerint;
	var songcheckint;

	var loads = []; // contains loading audio elements

	var canplay = []; // contains loaded audio elements
	var songsplay = []; // contains loaded song objects
	var guesses = -1;

	this.setgame = setgame;
	this.newgame = newgame;
	this.playpause = playpause;
	this.nextsong = nextsong;
	this.backsong = backsong;
	this.jumpsong = jumpsong;
	this.checkGuess = checkGuess;
	this.giveup = giveup
	this.settime = settime;
	this.STARTLOADING = STARTLOADING;

	function settime(time) {
		timesecs = time;
	}

	function gameEnded() {
		return ended;
	}

	var alpha = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

	function giveup() {
		revealanswers();
	}

	function updateSongList(song) {
		songs.push(song);
	}

	function STARTLOADING(num) {
		GETNSONGS(num);
	}

	function onGotSongs(num) {
		for (var i=0; i<num; i++) {
			var audioElement = document.createElement('audio');
			audioElement.setAttribute('src', songs[i].path);
			audioElement.currentTime = songs[i].startTime;
			audioElement.load();
			audioElement.setAttribute('id',songs[i].title)
			audioElement.preload = "auto";
			audioElement.added = false;
			audioElement.oncanplaythrough = function() {
				console.log("asfdasdf");
				console.log(canplay.indexOf(this));
				//console.log(this.added);
				//console.log(gameEnded());
				//console.log(this);
				if (canplay.indexOf(this) < 0 && !this.added && !gameEnded()) {
					canplay.push(this);
					t = this.getAttribute('id');

					// find the actual song json object to push
					for (var j=0; j<num; j++) {
						if (songs[j].title === t) {
							songsplay.push(songs[j]);
							//console.log("woot2"+t);
							console.log("woot3");
							this.added = true;
							break;
						}
					}
					
				}
			}
			loads.push(audioElement);
			//console.log(loads);
		}
	}

	function GETNSONGS(num) {
		$.get("getnsongs", {n:num})
		.done(function(data) {

			for (var i=0; i<num; i++) {
				songs.push(data[i]);
			}
			onGotSongs(num);
		});
	}

	function setgame() {

		// make sure we don't have song repeats
		
		//console.log("DLSKFLKJ");
		$('#interaction-unit').css('display', 'block');
		$('#score').html("Score: "+score);

		canplay.splice(CONFIG.numsongs, 25);

		for (var i=0; i<canplay.length; i++) {
			var t = canplay[i].getAttribute('id');
			//console.log(t);
			$('#loading').remove();
			$('#statusholder').append("<div class='status-box clickable' id='"+t.hashCode()+"' onclick='c.jumpsong("+i+")'>"+(i+1)+"</div>");
			
			if (canplay.length < CONFIG.numsongs) {
				$('#loadingholder').append("<div id='loading'>LOADING...</div>");
			}
		}

			
		// 	data.startTime = Math.floor((data.duration-15) * Math.random());
		// 	data.guess = false;
		// 	console.log(songs);
		// 	if (songs.indexOf(data)<=0) {
		// 		songs.push(data);
		// 		console.log('hella');
		// 	}
		// 	else {
		// 		$.get("getnewsong")
		// 		.done(function(data) {
					
		// 			data.startTime = Math.floor((data.duration-15) * Math.random());
		// 			data.guess = false;
		// 			if (songs.indexOf(data)<=0) {
		// 				songs.push(data);
		// 			}
		// 			else {
		// 				$.get("getnewsong")
		// 				.done(function(data) {
							
		// 					data.startTime = Math.floor((data.duration-15) * Math.random());
		// 					data.guess = false;
		// 					if (songs.indexOf(data)<=0) {
		// 						songs.push(data);
		// 					}
		// 					else {
		// 						location.reload();
		// 					}
		// 			});
		// 		}
		// 	});
		// }



		songcheckint = setInterval(function() {
			if (currentSong) {
				if (canplay[counter].currentTime >= currentSong.startTime + parseInt(CONFIG.songlen)) {
					canplay[counter].currentTime = currentSong.startTime;
				}
			}

			//console.log(canplay.length);
			//console.log($('#statusholder').children().length);

			if (canplay.length > $('#statusholder').children().length) {
				for (var i=($('#statusholder').children().length); i<canplay.length; i++) {

					var t = canplay[i].getAttribute('id');
					//console.log(t);
					$('#loading').remove();
					$('#statusholder').append("<div class='status-box clickable' id='"+t.hashCode()+"' onclick='c.jumpsong("+i+")'>"+(i+1)+"</div>");
					
					if (i+1 < CONFIG.numsongs) {
						//console.log('holla'+i);
						$('#loadingholder').append("<div id='loading'>LOADING...</div>");
					}
				}
			}


			// if guessed all (loaded) songs
			if (guesses >= canplay.length) {
				ended = true;
				pausesong();
				$('#interaction-unit').css('display', 'none');
				$('#loading').remove();
			}

				// first time
				//**********************
				if ((start || notplaying) && songs.length >= CONFIG.numsongs) {

					if (start) {

						// for (var i=0; i<CONFIG.numsongs; i++) {
							
						// }

						

						// for (var i=0; i<numsongs; i++) {
						// 	console.log("aksdf");
						// 	var audioElement = document.createElement('audio');
						// 	audioElement.setAttribute('src', songs[i].path);
						// 	audioElement.currentTime = songs[i].startTime;
						// 	audioElement.load();
						// 	audioElement.setAttribute('id',songs[i].title)
						// 	audioElement.preload = "auto";
						// 	audioElement.added = false;
						// 	audioElement.oncanplaythrough = function() {
						// 		if (canplay.indexOf(this) < 0 && !this.added && !gameEnded()) {
						// 			console.log("woott");
						// 			canplay.push(this);
						// 			console.log("woottt");
						// 			t = this.getAttribute('id');
						// 			console.log("woot"+t);
						// 			for (var j=0; j<numsongs; j++) {
						// 				if (songs[j].title === t) {
						// 					songsplay.push(songs[j]);
						// 					console.log("woot2"+t);
						// 					break;
						// 				}
						// 			}
						// 			console.log("woot3"+t);
						// 			$('#loading').remove();
						// 			$('#status').append("<div class='status-box clickable' id='"+t.hashCode()+"' onclick='c.jumpsong("+(canplay.indexOf(this))+")'>"+(canplay.indexOf(this)+1)+"</div>");
						// 			if (canplay.length < numsongs) {
						// 				$('#status').append("<div id='loading'>LOADING...</div>");
						// 			}
						// 			this.added = true;
						// 		}
						// 	}
						// 	loads.push(audioElement);
						// 	console.log(loads);
						// }
						// start = false;
					}

					if (canplay.length > 0) {
						// console.log(canplay);
						currentSong = songsplay[0];
						canplay[0].currentTime = currentSong.startTime;
						if(CONFIG.albumart) {
							$('#albumart').attr('src', 'images/'+currentSong.album+'.jpg');
						} else {
							$('#albumart').attr('src', 'images/noart.jpg');
						}
						$('#'+currentSong.title.hashCode()).css('border', '3px solid #333');
						canplay[0].play();
						notplaying = false;
						start = false;
					}

				}
		}, 500);

		timerint = setInterval(function() {
			// gameplay = 1, time decreasing
			if (CONFIG.gameplay && !notplaying && !ended) {
				timesecs -= 1;
				if (timesecs <= 15) {
					$('#timer').css('color','#fe2c3b');
				}

				if (timesecs < 0) {
					revealanswers();
				} else {
					$('#timer').html("Time: "+formatSecString(timesecs));
				}
			} else if (!ended && !notplaying) {
				timesecs += 1;
				$('#timer').html("Time: "+formatSecString(timesecs));
			}

		}, 1000);
	}

	function revealanswers() {
		canplay[counter].pause();
		$('#interaction-unit').css('display', 'none');
		$('#loading').remove();

		for(var i=0; i<canplay.length; i++) {
			var s = songsplay[i];
			if (!s.guess) {
				s.guess = true;
				$('#'+s.title.hashCode()).html("<i class='fa fa-times-circle'></i> "+s.title);
				$('#'+s.title.hashCode()).css('background', '#fe2c3b');
			}
		}

		ended = true;
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
		if (!ended) {
			song = songsplay[counter];

			$('#'+currentSong.title.hashCode()).css('border', '0px solid #333');
			currentSong = song;
			$('#'+currentSong.title.hashCode()).css('border', '3px solid #333');
			if (CONFIG.albumart) {
				$('#albumart').attr('src', '');
			}
		
			canplay[counter].currentTime = currentSong.startTime;
			canplay[counter].play();
			if (CONFIG.albumart) {
				$('#albumart').attr('src', 'images/'+currentSong.album+'.jpg');
			}
			$('#playpauser').attr('class', 'fa fa-pause-circle-o fa-5x');
		}
	}

	function newgame() {
		$('#GAME').css('display','none');
		$('#SETUP').css('display','block');
		ended = true;
		pausesong();
	 	$('#statusholder').html("");
	 	$('#loadingholder').html("");
	 	$('#timer').html("");
	 	$('#score').html("");
		clearInterval(timerint);
		clearInterval(songcheckint);
		for (var i=0; i<loads.length; i++) {
			loads[i].setAttribute('src','');
		}
		SETUP();
	}

	function formatSecString(secs) {
	    var mins = Math.floor(secs/60);
	    var se = Math.floor(secs % 60);
	    return mins+"m"+se+"s";
	}

	function strip(s) {
		return s.toLowerCase().replace(/['.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
	}

	function amendguess(stripped) {
		switch(stripped) {
			case "re education through labor":
			case "reeducation":
			case "re education":
				return "reeducation through labor";
				break;
			case "make it stop":
			case "septembers children":
				return "make it stop septembers children";
				break;
			case "collapse":
				return "collapse post amerika";
				break;
			default:
				return stripped;
		}
	}

	function checkGuess(guess) {
		if (!currentSong.guess) {
			currentSong.guess = true;
			if (guesses < 0) guesses=1;
			else guesses+=1;

			if (amendguess(strip(guess)) === strip(currentSong.title)) {
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

var c = null;
var savedPlaytime;


function GAME() {

	// $.get('/getConfig').done(function(data) {

		// FIXED NUMBER OF SONGS
		// if (CONFIG.gameplay === 0) {
		c.settime(CONFIG.playtime);
		c.setgame();
		// }
	// });

	var $guessForm = $('form.guessform').unbind();
}

function submitGuess() {
	event.preventDefault();
	var guess = $('#guess').val();
	$('#guess').val('');
	
	c.checkGuess(guess);
	return false;
};

function formatSecString(secs) {
	    var mins = Math.floor(secs/60);
	    var se = Math.floor(secs % 60);
	    return mins+"m"+se+"s";
	}

function fixedtime() {
	CONFIG.gameplay = 1;
	//console.log(CONFIG);
	$('#fixedtime').attr('class','button-primary');
	$('#fixednum').removeClass('button-primary');

	$('#allotted').css('display', 'block');
	$('#playtime').val(savedPlaytime);
	$('#playtime-res').text(formatSecString(savedPlaytime));
	CONFIG.playtime = savedPlaytime;

	return false;
}

function fixednum () {
	CONFIG.gameplay = 0;
	//console.log(CONFIG);
	$('#fixednum').attr('class','button-primary');
	$('#fixedtime').removeClass('button-primary');
	CONFIG.playtime = 0;
	$('#allotted').css('display', 'none');

	return false;
}

function startgame() {
	// localStorage.setItem("conf", JSON.stringify(CONFIG));
	// console.log(JSON.parse(localStorage.getItem("conf")));
	// console.log(CONFIG);
	// $.post('/updateConfig', CONFIG).success(
	// 	$(location).attr('href', '/game')
	// );
	$('#SETUP').css('display','none');
	$('#GAME').css('display','block');
	
	GAME();
}

function reset() {
	// $.get('/reset').done(function(data) {
		CONFIG = defaultconfig;
		$('#numsongs-res').text(CONFIG.numsongs);
		$('#numsongs').val(CONFIG.numsongs);
		$('#songlen-res').text(CONFIG.songlen);
		$('#songlen').val(CONFIG.songlen);
		$('#playtime-res').text(CONFIG.playtime);
		$('#playtime').val(CONFIG.playtime);
		$('#myonoffswitch')[0].checked = CONFIG.albumart ? true : false;

		if (CONFIG.playtime===0) {
			savedPlaytime = 180;
		} else {
			savedPlaytime = CONFIG.playtime;
		}

		if (CONFIG.gameplay===1) {
			fixedtime();
		} else {
			fixednum();
		}
	// });
}

function SETUP() {

	c = null;
	c = new Container();
	c.STARTLOADING(25);

	// $.get('/getConfig').done(function(data) {
	// 	CONFIG = data;
		$('#numsongs-res').text(CONFIG.numsongs);
		$('#numsongs').val(CONFIG.numsongs);
		$('#songlen-res').text(CONFIG.songlen);
		$('#songlen').val(CONFIG.songlen);
		$('#playtime-res').text(CONFIG.playtime);
		$('#playtime').val(CONFIG.playtime);
		//console.log($('#myonoffswitch')[0]);
		$('#myonoffswitch')[0].checked = CONFIG.albumart ? true : false;

		if (CONFIG.playtime===0) {
			savedPlaytime = 180;
		} else {
			savedPlaytime = CONFIG.playtime;
		}

		if (CONFIG.gameplay===1) {
			fixedtime();
		} else {
			fixednum();
		}
	// });


	$('#myonoffswitch').change(function() {
		//console.log("HOLLA");
		if(this.checked) {
			CONFIG.albumart = 1;
		} else {
			CONFIG.albumart = 0;
		}
	});

	// Initialize a new plugin instance for all
	// e.g. $('input[type="range"]') elements.

    $('input[type="range"]').rangeslider();

	$('input').on('input', function () {
		console.log("WKASLFD");
		CONFIG[$(this).attr('id')] = parseInt($(this).val());
		
		if($(this).attr('id') === 'playtime') {
			$('#'+$(this).attr('id')+"-res").text(formatSecString(parseInt($(this).val())));
			savedPlaytime = CONFIG.playtime;
		} else if($(this).attr('id') === 'songlen') {
			$('#'+$(this).attr('id')+"-res").text($(this).val() + " sec");
		} else {
			$('#'+$(this).attr('id')+"-res").text($(this).val());
		}
	});

}

SETUP();
