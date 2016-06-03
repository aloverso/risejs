// var CONFIG = JSON.parse(localStorage.getItem("conf"));

// console.log(CONFIG);


var CONFIG = {
    "gameplay": 0,
    "songlen": 5,
    "numsongs": 10,
    "albumart": 1,
    "playtime":3
};

$.post('/updateConfig',CONFIG).success();

function formatSecString(secs) {
	    var mins = Math.floor(secs/60);
	    var se = Math.floor(secs % 60);
	    return mins+"m"+se+"s";
	}

function fixedtime() {
	CONFIG.gameplay = 1;
	console.log(CONFIG);
	$('#fixedtime').attr('class','active');
	$('#fixednum').removeClass('active');

	$('#allotted').css('display', 'block');
	$('#playtime-res').text(formatSecString(180));

	return false;
}

function fixednum () {
	CONFIG.gameplay = 0;
	console.log(CONFIG);
	$('#fixednum').attr('class','active');
	$('#fixedtime').removeClass('active');

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