var module = {};


module.slideLeft = function(buttonRef) {
	var curSlider = buttonRef.parent().parent('.thumbslider__list-wrapper').find('.thumbslider__list');
	curSlider.animate({
		'margin-left':'+=' + module.$slideDistance
	});
}

module.slideRight = function(buttonRef) {
	var curSlider = buttonRef.parent().parent('.thumbslider__list-wrapper').find('.thumbslider__list');
	curSlider.animate({
		'margin-left':'-=' + module.$slideDistance
	});
}

module.eventHandlers = function() {
	module.$leftNav.click(function() {
		module.slideLeft($(this))
	});
	module.$rightNav.click(function() {
		module.slideRight($(this))
	});
};

module.init = function() {
	module.$leftNav = $('.thumbslider__nav-left');
	module.$rightNav = $('.thumbslider__nav-right');
	module.$slideDistance = ($('.thumbslider__item').width() * 5) + 'px';
	module.eventHandlers();
};


$(document).ready(function() {
	module.init();
});