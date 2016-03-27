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


//var startTime = 0;
var currentSong;
var numsongs = 10;
var songs = [];
var counter = 0;
var start = true;
var timesecs = 0;
var score = 0;

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

function setgame() {
	for (var i=0; i<numsongs; i++) {
		$.get("getnewsong")
		.done(function(data) {
			data.startTime = Math.floor((data.duration-15) * Math.random());
			data.guess = false;
			songs.push(data);

			//$loads.append("<audio id='"+data.title.hashCode()+"'></audio>");
			//$('#'+data.title.hashCode()).attr('src', data.path);

			// $('#'+data.title.hashCode())[0].oncanplay = function() {
			// 	data.startTime = Math.floor(($('#'+data.title.hashCode())[0].duration-10) * Math.random());
			// 	songs.push(data);
			// }

			//data.startTime = Math.floor(($('#demo')[0].duration-10) * Math.random());
			$('#status').append("<div class='status-box' id='"+data.title.hashCode()+"' onclick='jumpsong("+(songs.indexOf(data))+")'>"+(songs.indexOf(data)+1)+"</div>");
		});

		
	}
}

setgame();

function getcurrent() {
	console.log($('#demo')[0].currentTime);
	console.log(currentSong.startTime);
}

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
	if ($('#demo')[0].paused) {
		$('#demo')[0].play();
		$('#playpauser').attr('class', 'fa fa-pause-circle-o fa-5x');
	}
	else {
		$('#demo')[0].pause();
		$('#playpauser').attr('class', 'fa fa-play-circle-o fa-5x');
	}
}

function pausesong() {
	$('#demo')[0].pause();
}

function skiptoten() {
	document.getElementById("demo").currentTime = 10;
}

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
	if (counter < numsongs -1) {
		counter = counter + 1;
		updatesong();
	}
}

function backsong() {
	if (counter > 0) {
		counter = counter - 1;
		updatesong();
	}
}

function jumpsong(i) {
	counter = i;
	updatesong();
}

function updatesong() {
	song = songs[counter];
	$('#demo').attr('src', song.path);
	$('#demo')[0].oncanplay = function() {
		if ($('#demo')[0].currentTime < 1) {
			$('#'+currentSong.title.hashCode()).css('border', '0px solid #333');
			currentSong = song;
			$('#demo')[0].currentTime = currentSong.startTime;
			$('#albumart').attr('src', 'images/'+currentSong.album+'.jpg');
			$('#playpauser').attr('class', 'fa fa-pause-circle-o fa-5x');
			$('#'+currentSong.title.hashCode()).css('border', '3px solid #333');
		}
	}
}

function newgame() {
	currentSong;
	songs = [];
	counter = 0;
	start = true;
	timesecs = 0;
	score = 0;

	setgame();
	$('#timer').html("0");
	$('#score').html("0");
	$('#status').html("");
}

function strip(s) {
	return s.toLowerCase().replace(/['.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
}

function formatSecString(secs) {
    var mins = Math.floor(secs/60);
    var se = Math.floor(secs % 60);
    return mins+"m"+se+"s";
}

setInterval(function() {
	if (currentSong) {
		if ($('#demo')[0].currentTime >= currentSong.startTime + 10) {
			$('#demo')[0].currentTime = currentSong.startTime;
		}
	}
	// first time
	if (start && songs.length > 0) {
		$('#demo').attr('src', songs[0].path);
		currentSong = songs[0];
		$('#demo')[0].currentTime = songs[0].startTime;
		$('#albumart').attr('src', 'images/'+songs[0].album+'.jpg');
		$('#'+songs[0].title.hashCode()).css('border', '3px solid #333');
		start = false;
	}
	//console.log(currentSong);
}, 500);

setInterval(function() {
	timesecs += 1;
	$('#timer').html("Time: "+formatSecString(timesecs));
}, 1000);


var $guessForm = $('form.guessform').unbind();
$guessForm.submit(function(event) {
	event.preventDefault();
	var guess = $guessForm.find('#guess').val();
	$guessForm.find('#guess').val('');
	console.log(strip(guess));
	console.log(strip(currentSong.title));
	if (!currentSong.guess) {
		currentSong.guess = true;

		if (strip(guess) === strip(currentSong.title)) {
			console.log("MATCH");
			nextsong();
			score += 1;
			$('#score').html("Score: "+score);
			$('#'+currentSong.title.hashCode()).html(currentSong.title);
			$('#'+currentSong.title.hashCode()).css('background', '#00eb34');
		}
		else {
			nextsong();
			$('#'+currentSong.title.hashCode()).html(currentSong.title);
			$('#'+currentSong.title.hashCode()).css('background', '#fe2c3b');
		}
	}
});