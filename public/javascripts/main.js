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
    "playtime":180,
    "username":undefined,
    "contestName":undefined
};

var CONFIG = {
	"gameplay": 1,
    "songlen": 10,
    "numsongs": 10,
    "albumart": 1,
    "playtime":180,
    "username":undefined,
    "contestName":undefined
};

function Container() {

	var currentSong;
	var counter = 0;
	var gamehasstarted = false;
	var timesecs = CONFIG.playtime;
	var score = 0;
	var ended = false;
	var notsaved = true;

	var prevtime;

	var timerint;
	var songcheckint;

	var songs = []; // contains loading song objects
	var loads = []; // contains loading audio elements

	var canplay = []; // contains loaded audio elements
	var songsplay = []; // contains loaded song objects
	var extrasongs = []; // extra loaded audio elements
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
	this.canplay = canplay

	function settime(time) {
		timesecs = time;
	}

	function gameEnded() {
		return ended;
	}

	function giveup() {
		revealanswers();
	}

	// function updateSongList(song) {
	// 	songs.push(song);
	// }

	function STARTLOADING(num) {
		GETNSONGS(num);
	}

	function onGotSongs(num) {
		for (var i=0; i<num; i++) {
			var s = songs[i];
			var audioElement = document.createElement('audio');
			audioElement.setAttribute('src', s.path);
			audioElement.currentTime = s.startTime;
			audioElement.load();
			audioElement.setAttribute('id',s.title)
			audioElement.preload = "auto";
			audioElement.added = false;

			audioElement.oncanplaythrough = function() {
				// console.log(this.readyState);
				// console.log("getting called");
				if (canplay.indexOf(this) < 0 && !this.added && !gameEnded()) {
					// add a song to extras just in case
					if (canplay.length > 0 && extrasongs.length === 0) {
						extrasongs.push(this);
					} else {
						canplay.push(this);
						t = this.getAttribute('id');

						for (var j=0; j<num; j++) {
							if (songs[j].title === t) {
								songsplay.push(songs[j]);
								console.log("load");
								this.added = true;
								break;
							}
						}
					}
					
				}
			}
			loads.push(audioElement);
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

		document.addEventListener('play', function(e){
		    var audios = document.getElementsByTagName('audio');
		    for(var i = 0, len = audios.length; i < len;i++){
		        console.log(audios[i]);
		    }
		}, true);
		// reset elements
		$('#giveup-button').css('display', 'inline');
		$('#interaction-unit').css('display', 'block');
		$('#contest-message').html('');
		$('#score').html("Score: "+score + " / "+CONFIG.numsongs);
		$('#timer').css('color','#000');
		$('#playpauser').attr('class', 'fa fa-pause-circle-o fa-5x clickable');

		// only use required songs
		extrasongs = canplay.splice(CONFIG.numsongs, 25);

		// append any ready-to-play songs
		for (var i=0; i<canplay.length; i++) {
			var t = canplay[i].getAttribute('id');
			$('#loading').remove();
			$('#statusholder').append("<div class='status-box clickable' id='"+t.hashCode()+"' onclick='c.jumpsong("+i+")'>"+(i+1)+"</div>");
			
			if (canplay.length < CONFIG.numsongs) {
				$('#loadingholder').append("<div id='loading'>LOADING...</div>");
			}
		}

		// create 200ms interval to check for song reset time (and other functions)
		songcheckint = setInterval(function() {
			// console.log(currentSong, canplay[counter]);
			if (currentSong != undefined && canplay[counter] != undefined) {
				if (canplay[counter].currentTime >= currentSong.startTime + parseInt(CONFIG.songlen)) {
					canplay[counter].currentTime = currentSong.startTime;
				}
			}

			// as more songs load keep splicing
			extrasongs = extrasongs.concat(canplay.splice(CONFIG.numsongs, 25));
			// console.log(extrasongs.length);

			// add any more songs that have loaded to the statusholder
			if (canplay.length > $('#statusholder').children().length) {
				for (var i=($('#statusholder').children().length); i<canplay.length; i++) {

					var t = canplay[i].getAttribute('id');
					// console.log(t);
					$('#loading').remove();
					$('#statusholder').append("<div class='status-box clickable' id='"+t.hashCode()+"' onclick='c.jumpsong("+i+")'>"+(i+1)+"</div>");
					
					if (i+1 < CONFIG.numsongs) {
						$('#loadingholder').append("<div id='loading'>LOADING...</div>");
					}
				}
			}

			// if guessed all (loaded) songs
			if (guesses >= canplay.length) {
				revealanswers();
			}

			// first time - wait until we can play at least one song (but only execute this once)
			//**********************
			if (canplay.length > 0 && !gamehasstarted) {
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
				gamehasstarted = true;
			}

		}, 200);

		// set interval to increment timer
		timerint = setInterval(function() {
			// if we're playing count-down game
			if (CONFIG.gameplay && gamehasstarted && !ended) {
				timesecs -= 1;
				if (timesecs <= 15) {
					$('#timer').css('color','#fe2c3b');
				}

				if (timesecs < 0) {
					timesecs = 0;
					revealanswers();
				} else {
					$('#timer').html("Time: "+formatSecString(timesecs));
				}
			} else if (gamehasstarted && !ended) { // count-up game
				timesecs += 1;
				$('#timer').html("Time: "+formatSecString(timesecs));
			}
			// console.log(canplay[counter].currentTime);
			// console.log(canplay[counter].paused);

			// check for failed songs
			if (canplay[counter].currentTime === prevtime && !canplay[counter].paused) {
				console.log("nooooooooo");
				console.log(canplay[counter].readyState);

				// get rid of song, pull one from extras
				var orig_t = canplay[counter].getAttribute('id');
				canplay[counter].pause();

				var replacement_song = extrasongs.pop();
				canplay[counter] = replacement_song;

				var t = replacement_song.getAttribute('id');
				for (var j=0; j<songs.length; j++) {
					if (songs[j].title === t) {
						songsplay[counter] = songs[j];
						currentSong = songsplay[counter];
						// console.log(currentSong);
						canplay[counter].play();
						console.log("RELOADED");

						// fix status id
						$('#'+orig_t.hashCode()).attr('id',t.hashCode());
						if (CONFIG.albumart) {
							$('#albumart').attr('src', 'images/'+currentSong.album+'.jpg');
						}

						replacement_song.added = true;
						break;
					}
				}
				// console.log(currentSong);
			}

			prevtime = canplay[counter].currentTime;

		}, 1000);
	}

	function revealanswers() {
		pausesong();
		$('#interaction-unit').css('display', 'none');
		$('#loading').remove();
		$('#giveup-button').css('display', 'none');

		// set unguessed status blocks to red and show title
		for(var i=0; i<canplay.length; i++) {
			var s = songsplay[i];
			if (!s.guess) {
				s.guess = true;
				$('#'+s.title.hashCode()).html("<i class='fa fa-times-circle'></i> "+s.title);
				$('#'+s.title.hashCode()).css('background', '#fe2c3b');
			}
		}

		ended = true;

		// if playing a contest, save score and show place
		if (CONFIG.contestName && CONFIG.username && notsaved) {
			console.log("in it");
			$.post('/saveEntry', {
				'name': CONFIG.username,
				'contest': CONFIG.contestName,
				'score': score,
				'timesecs': CONFIG.playtime - timesecs 
			}).success(function(data) {
				notsaved = false;
				$('#contest-message').html(makeContestMessage(data.place, data.total));
			});
		}
	}

	function makeContestMessage(place, total) {
		var message = 'Congrats! You placed at number ' 
		+ place + ' of ' + total
		+ ' in the "' + CONFIG.contestName + '" contest!';
		if (place <= 10) {
			message += '\nCheck the leaderboard to see your entry!';
		}
		return '<div class="contestmessage"><span class="lefticon"><i class="lefticon fa fa-trophy fa-4x"></i></span><span>'
		+message+'</span></div>';
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
		
			canplay[counter].currentTime = currentSong.startTime;
			canplay[counter].play();
			if (CONFIG.albumart) {
				$('#albumart').attr('src', 'images/'+currentSong.album+'.jpg');
			}
			$('#playpauser').attr('class', 'fa fa-pause-circle-o fa-5x');
		}
	}

	// switch back to setup mode
	function newgame() {
		$('#GAME').css('display','none');
		$('#SETUP').css('display','block');
		CONFIG.username = undefined;
		CONFIG.contestName = undefined;
		ended = true;
		notsaved = true;
		pausesong();
	 	$('#statusholder').html("");
	 	$('#loadingholder').html("");
	 	$('#timer').html("");
	 	$('#score').html("");
	 	$('#extreme').html('<li class="headerrow"><span class="namespan">User</span><span class="timespan">Time</span><span class="scorespan">Score</span></li>');
	 	$('#ordinary').html('<li class="headerrow"><span class="namespan">User</span><span class="timespan">Time</span><span class="scorespan">Score</span></li>');
		clearInterval(timerint);
		clearInterval(songcheckint);
		for (var i=0; i<loads.length; i++) {
			loads[i].setAttribute('src','');
		}
		SETUP();
	}

	function strip(s) {
		return s.toLowerCase().replace(/['.,\/#!$%\^&\*;:{}=_`~()]/g,"").replace(/\-/g," ");
	}

	function amendguess(stripped) {
		switch(stripped) {
			case "re education through labor":
			case "reeducation":
			case "re education":
			case "reeducation through labor":
				return "re education through labor";
				break;
			case "make it stop":
			case "septembers children":
				return "make it stop septembers children";
				break;
			case "collapse":
				return "collapse post amerika";
				break;
			case "the ballad of hollis brown":
			case "hollis brown":
				return "ballad of hollis brown";
				break;
			case "ghost of tom joad":
				return "the ghost of tom joad";
				break;	
			case "strength to go on":
				return "the strength to go on";
				break;
			case "anyway you want it":
				return "any way you want it";
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
				$('#score').html("Score: "+score + " / " + CONFIG.numsongs);
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
		return false;
	}
}

function submitGuess(event) {
	event.preventDefault();
	var guess = $('#guess').val();
	$('#guess').val('');
	
	c.checkGuess(guess);
	return false;
};

function formatSecString(secs) {
	    var mins = Math.floor(secs/60);
	    var se = Math.floor(secs % 60);
	    if (mins===0) {
	    	return se+"s"
	    }
	    return mins+"m"+se+"s";
	}

function timelimit() {
	CONFIG.gameplay = 1;
	$('#timelimit').attr('class','button-primary');
	$('#infinitetime').removeClass('button-primary');
	$('#allotted').css('display', 'block');
	$('#playtime').val(savedPlaytime);
	$('#playtime-res').text(formatSecString(savedPlaytime));
	CONFIG.playtime = savedPlaytime;

	return false;
}

function infinitetime () {
	CONFIG.gameplay = 0;
	$('#infinitetime').attr('class','button-primary');
	$('#timelimit').removeClass('button-primary');
	CONFIG.playtime = 0;
	$('#allotted').css('display', 'none');

	return false;
}

function startgame() {
	$('#SETUP').css('display','none');
	$('#GAME').css('display','block');
	
	c.settime(CONFIG.playtime);
	c.setgame();

	var $guessForm = $('form.guessform').unbind();
}

function setSlidersToConfigs() {
	$('#numsongs-res').text(CONFIG.numsongs);
	$('#numsongs').val(CONFIG.numsongs);
	$('#songlen-res').text(CONFIG.songlen + ' sec');
	$('#songlen').val(CONFIG.songlen);
	$('#playtime-res').text(CONFIG.playtime);
	$('#playtime').val(CONFIG.playtime);
	$('#myonoffswitch')[0].checked = CONFIG.albumart ? true : false;
}

function reset() {
	for (var attr in defaultconfig) {
		CONFIG[attr] = defaultconfig[attr];
	}
	setSlidersToConfigs();

	savedPlaytime = CONFIG.playtime;

	timelimit();
}

function SETUP() {

	c = null;
	c = new Container();
	c.STARTLOADING(25);

	setSlidersToConfigs();

	if (CONFIG.playtime===0) {
		savedPlaytime = 180;
	} else {
		savedPlaytime = CONFIG.playtime;
	}

	if (CONFIG.gameplay===1) {
		timelimit();
	} else {
		infinitetime();
	}

	populateContest('extreme');
	populateContest('ordinary');


	$('#myonoffswitch').change(function() {
		if(this.checked) {
			CONFIG.albumart = 1;
		} else {
			CONFIG.albumart = 0;
		}
	});

    $('input[type="range"]').rangeslider();

	$('input').on('input', function () {
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

function populateContest(id) {
	$.get("/getEntries", {'contest': id, 'number': 10})
  	.done(function(data) {
  		$list = $('#'+id);
  		for (var i=0; i<10; i++) {
  			if(data[i])	$list.append(makeEntry(data[i].name, data[i].timesecs, data[i].score));
  		}
  	});
}

function makeEntry(name, time, score) {
	return '<li class="entry">' 
	    + '<span class="namespan">' + name + '</span>'
		+ '<span class="timespan">' + formatSecString(time) + '</span>'
		+ '<span class="scorespan">' + score + '</span>'
		+ '</li>';
}

function join(contest) {
	var name = prompt("Enter a name for the leaderboard");
	if (name) {
		if (contest==="extreme") {
			CONFIG = {
				"gameplay": 1,
			    "songlen": 1,
			    "numsongs": 10,
			    "albumart": 0,
			    "playtime":60,
			    "username":name.slice(0,25),
			    "contestName":contest
			};
		} else if (contest==="ordinary") {
			CONFIG = {
				"gameplay": 1,
			    "songlen": 5,
			    "numsongs": 10,
			    "albumart": 1,
			    "playtime":180,
			    "username":name.slice(0,25),
			    "contestName":contest
			};
		}
		startgame();
	}
}

var c = null;
var savedPlaytime;

SETUP();
