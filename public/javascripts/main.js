// // //Create the audio tag
// var soundFile = document.createElement("audio");
// soundFile.preload = "auto";

// // //Load the sound file (using a source element for expandability)
// var src = document.createElement("source");
// src.src = "audios/satellite.mp3";
// soundFile.appendChild(src);

// // //Load the audio tag
// // //It auto plays as a fallback
// soundFile.load();
// soundFile.volume = 0.000000;
// soundFile.play();

// play();
	
// // //Plays the sound
// function play() {
//    //Set the current time for the audio file to the beginning
//    soundFile.currentTime = 0.01;
//    soundFile.volume = volume;

//    //Due to a bug in Firefox, the audio needs to be played after a delay
//    setTimeout(function(){soundFile.play();},1);
// }

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

var opts = {
  lines: 11 // The number of lines to draw
, length: 29 // The length of each line
, width: 16 // The line thickness
, radius: 46 // The radius of the inner circle
, scale: 1 // Scales overall size of the spinner
, corners: 1 // Corner roundness (0..1)
, color: '#000' // #rgb or #rrggbb or array of colors
, opacity: 0.25 // Opacity of the lines
, rotate: 0 // The rotation offset
, direction: 1 // 1: clockwise, -1: counterclockwise
, speed: 0.8 // Rounds per second
, trail: 60 // Afterglow percentage
, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
, zIndex: 2e9 // The z-index (defaults to 2000000000)
, className: 'spinner' // The CSS class to assign to the spinner
, top: '50%' // Top position relative to parent
, left: '50%' // Left position relative to parent
, shadow: false // Whether to render a shadow
, hwaccel: false // Whether to use hardware acceleration
, position: 'absolute' // Element positioning
}

function Container() {

	//var startTime = 0;
	var currentSong;
	var numsongs = 10;
	var songs = [];
	var counter = 0;
	var start = true;
	var notplaying = true;
	var timesecs = 0;
	var score = 0;
	var songlen = 5;

	//var audioFiles = [];
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

	// function setgame() {
	// 	for (var i=0; i<20; i++) {
	// 		$.get("getnewsong")
	// 		.done(function(data) {
	// 			//data.startTime = Math.floor(($('#demo')[0].duration-10) * Math.random());
	// 			songs.push(data);
	// 		});
	// 	}
	// }
	var alpha = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

	// function preloadAudio(url) {
	//     var audio = new Audio();
	//     // once this file loads, it will call loadedAudio()
	//     // the file will be kept by the browser as cache
	//     audio.addEventListener('canplay', loadedAudio, false);
	//     audio.src = url;
	//     //audio.currentTime = 30;
	// }

	// var loaded = 0;
	// function loadedAudio() {
	//     // this will be called every time an audio file is loaded
	//     // we keep track of the loaded files vs the requested files
	//     console.log("holla");
	//     console.log(this);
	//     console.log(songs[0])
	//     play(0);
	//     loaded++;
	//     if (loaded == numsongs){
	//     	// all have loaded
	//     	//init();
	//     }
	// }

	// function init() {
	//     // do your stuff here, audio has been loaded
	//     // for example, play all files one after the other
	//     var i = 0;
	//     // once the player ends, play the next one
	//     player.onended = function() {
	//     	i++;
	//         if (i >= audioFiles.length) {
	//             // end 
	//             return;
	//         }
	//     	play(i);
	//     };
	//     // play the first file
	//     play(i);
	// }

	// var player = document.getElementById('player');

	// function play(index) {
	//     player.src = songs[index].path;
	//     player.play();
	// }

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

				//$loads.append("<audio id='"+data.title.hashCode()+"'></audio>");
				//$('#'+data.title.hashCode()).attr('src', data.path);

				// $('#'+data.title.hashCode())[0].oncanplay = function() {
				// 	data.startTime = Math.floor(($('#'+data.title.hashCode())[0].duration-10) * Math.random());
				// 	songs.push(data);
				// }

				//data.startTime = Math.floor(($('#demo')[0].duration-10) * Math.random());
				//$('#preloads').append('<audio id="demo'+data.title.hashCode()+'" preload="auto" src="'+data.path+'"></audio>');

			
		}

		setInterval(function() {
			if (currentSong) {
				if (canplay[counter].currentTime >= currentSong.startTime + songlen) {
					canplay[counter].currentTime = currentSong.startTime;
				}
			}

				// first time
				//**********************
				if ((start || notplaying) && songs.length > 1) {

					if (start) {
						console.log("FUCK");
						for (var i=0; i<numsongs; i++) {
							var audioElement = document.createElement('audio');
							audioElement.setAttribute('src', songs[i].path);
							audioElement.currentTime = songs[i].startTime;
							audioElement.load();
							audioElement.setAttribute('id',songs[i].title)
							audioElement.preload = "auto";
							audioElement.oncanplaythrough = function() {
								if (canplay.indexOf(this) < 0) {
									canplay.push(this);
									t = this.getAttribute('id');
									for (var j=0; j<numsongs; j++) {
										if (songs[j].title === t) {
											songsplay.push(songs[j]);
											break;
										}
									}
									$('#loading').remove();
									$('#status').append("<div class='status-box clickable' id='"+t.hashCode()+"' onclick='c.jumpsong("+(canplay.indexOf(this))+")'>"+(canplay.indexOf(this)+1)+"</div>");
									if (canplay.length < numsongs) {
										$('#status').append("<div id='loading'>LOADING...</div>");
									}

								}
							}
							loads.push(audioElement);
						}
						start = false;
					}

					//$('#demo').attr('src', songs[0].path);
					if (canplay.length > 0) {
						currentSong = songsplay[0];
						canplay[0].currentTime = currentSong.startTime;
						$('#albumart').attr('src', 'images/'+currentSong.album+'.jpg');
						$('#'+currentSong.title.hashCode()).css('border', '3px solid #333');
						canplay[0].play();
						notplaying = false;
					}

				}
			// if (songs.length == numsongs && start) {
			// 	start = false;
			// 	console.log("loading");
			// 	// we start preloading all the audio files
			// 	// var audioElement = document.createElement('audio');
			// 	// audioElement.setAttribute('src', songs[0].path);
			// 	// audioElement.load();
			// 	// audioElement.currentTime = 30;
			// 	// audioElement.play();
			// 	for (var i in songs) {
				    
			// 	    //preloadAudio(songs[i].path);
			// 	}
			// }
			//console.log(currentSong);
		}, 500);

		setInterval(function() {
			timesecs += 1;
			$('#timer').html("Time: "+formatSecString(timesecs));
		}, 1000);



	}

	// function getcurrent() {
	// 	console.log($('#demo')[0].currentTime);
	// 	console.log(currentSong.startTime);
	// }

	// function newsong() {
	// 	$('#demo').attr('src', 'audios/helpisontheway.mp3');
	// 	//console.log($('#demo').attr('src'));
	// 	//document.getElementById("demo").currentTime = 10;
	// 	$('#demo')[0].oncanplay = function() {
	// 		if ($('#demo')[0].currentTime < 1) {
	// 			startTime = Math.floor(($('#demo')[0].duration-10) * Math.random());
	// 			console.log(startTime);
	// 			$('#demo')[0].currentTime = startTime;
	// 		}
	// 	}
	// 		// console.log($('#demo')[0].duration);
			
	// 		// 
	// 		// $('#demo')[0].play();
	// 		// console.log($('#demo')[0].currentTime);

	// 	//}
	// 	//console.log(startTime);
	// }

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

	// function skiptoten() {
	// 	document.getElementById("demo").currentTime = 10;
	// }

	// function nextsong() {
	// 	$.get("getnewsong")
	// 	.done(function(data) {

	// 		$('#demo').attr('src', data.path);
	// 		$('#demo')[0].oncanplay = function() {
	// 			if ($('#demo')[0].currentTime < 1) {
	// 				startTime = Math.floor(($('#demo')[0].duration-10) * Math.random());
	// 				console.log(startTime);
	// 				$('#demo')[0].currentTime = startTime;
	// 				currentSong = data.title;
	// 				$('#albumart').attr('src', 'images/'+data.album+'.jpg');
	// 			}
	// 		}
	// 	});
	// }

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
		//*******$('#demo').attr('src', song.path);

		$('#'+currentSong.title.hashCode()).css('border', '0px solid #333');
		currentSong = song;
		$('#'+currentSong.title.hashCode()).css('border', '3px solid #333');
		$('#albumart').attr('src', '');
		// loads[counter].pause();
		// var target = document.getElementById('albumart');
		// var spinner = new Spinner(opts).spin(target);


		// if (canplay[counter].currentTime < 1) {
		// 	// spinner.stop();
		canplay[counter].currentTime = currentSong.startTime;
		canplay[counter].play();
		$('#albumart').attr('src', 'images/'+currentSong.album+'.jpg');
		$('#playpauser').attr('class', 'fa fa-pause-circle-o fa-5x');
		// }
		// canplay[counter].oncanplay = function() {
		// 	console.log("HELLA");
		// 	if (canplay[counter].currentTime < 1) {
		// 		// spinner.stop();
		// 		canplay[counter].currentTime = currentSong.startTime;
		// 		canplay[counter].play();
		// 		$('#albumart').attr('src', 'images/'+currentSong.album+'.jpg');
		// 		$('#playpauser').attr('class', 'fa fa-pause-circle-o fa-5x');
		// 	}
		// }
	}

	function newgame() {
		canplay[counter].pause();
		currentSong = null;
		songs = [];
		counter = 0;
		start = true;
		notplaying = true;
		timesecs = 0;
		score = 0;

		loads = [];

		canplay = [];
		songsplay = [];

		setgame();
		$('#timer').html("0");
		$('#score').html("0");
		$('#status').html("");
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

var c = new Container();

c.setgame();

var $guessForm = $('form.guessform').unbind();
$guessForm.submit(function(event) {
	event.preventDefault();
	var guess = $guessForm.find('#guess').val();
	$guessForm.find('#guess').val('');
	//console.log(strip(currentSong.title));
	
	c.checkGuess(guess);
});