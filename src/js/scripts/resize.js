'use strict';

$(function() {
	var $win       = $(window);
	var $container = $('.container');
	var threshold  = 0.6;

	$win.resize(function () {
		$container.toggleClass('container--flexible', $win.height() / $win.width() < threshold);
	}).resize();
});