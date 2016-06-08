// var CONFIG = JSON.parse(localStorage.getItem("conf"));

// console.log(CONFIG);

var CONFIG;

var savedPlaytime;

$.get('/getConfig').done(function(data) {
	CONFIG = data;
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
});

function formatSecString(secs) {
	    var mins = Math.floor(secs/60);
	    var se = Math.floor(secs % 60);
	    return mins+"m"+se+"s";
	}

function fixedtime() {
	CONFIG.gameplay = 1;
	console.log(CONFIG);
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
	console.log(CONFIG);
	$('#fixednum').attr('class','button-primary');
	$('#fixedtime').removeClass('button-primary');
	CONFIG.playtime = 0;
	$('#allotted').css('display', 'none');

	return false;
}

function startgame() {
	// localStorage.setItem("conf", JSON.stringify(CONFIG));
	// console.log(JSON.parse(localStorage.getItem("conf")));
	console.log(CONFIG);
	$.post('/updateConfig', CONFIG).success(
		$(location).attr('href', '/game')
	);
}

function reset() {
	$.get('/reset').done(function(data) {
		CONFIG = data;
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
	});
}

$('#myonoffswitch').change(function() {
	console.log("HOLLA");
	if(this.checked) {
		CONFIG.albumart = 1;
	} else {
		CONFIG.albumart = 0;
	}
});

// Initialize a new plugin instance for all
// e.g. $('input[type="range"]') elements.

$(document).ready(function () {
    $('input[type="range"]').rangeslider();

});

$('input').on('input', function () {
	CONFIG[$(this).attr('id')] = $(this).val();
	
	if($(this).attr('id') === 'playtime') {
		$('#'+$(this).attr('id')+"-res").text(formatSecString(parseInt($(this).val())));
		savedPlaytime = CONFIG.playtime;
	} else if($(this).attr('id') === 'songlen') {
		$('#'+$(this).attr('id')+"-res").text($(this).val() + " sec");
	} else {
		$('#'+$(this).attr('id')+"-res").text($(this).val());
	}
});

// $('input[type="range"]').rangeslider({

//     // Feature detection the default is `true`.
//     // Set this to `false` if you want to use
//     // the polyfill also in Browsers which support
//     // the native <input type="range"> element.
//     polyfill: true,

//     // Default CSS classes
//     rangeClass: 'rangeslider',
//     disabledClass: 'rangeslider--disabled',
//     horizontalClass: 'rangeslider--horizontal',
//     verticalClass: 'rangeslider--vertical',
//     fillClass: 'rangeslider__fill',
//     handleClass: 'rangeslider__handle',

//     // Callback function
//     onInit: function() {},

//     // Callback function
//     onSlide: function(position, value) {
//     	console.log(value);
//     },

//     // Callback function
//     onSlideEnd: function(position, value) {}
// });

// Destroy all plugin instances created from the
// e.g. $('input[type="range"]') elements.
// $('input[type="range"]').rangeslider('destroy');

// Update all rangeslider instances for all
// e.g. $('input[type="range"]') elements.
// Usefull if you changed some attributes e.g. `min` or `max` etc.
// $('input[type="range"]').rangeslider('update', true);