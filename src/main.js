import { init as initStage } from './stage';
import { initBall } from './ball';
import {initLoading} from './loading';
import {initRain} from './rain';
import './style/main.less';
$(window).on('stage_show', function () {
	initStage();
});
$(window).on('ball_show', function () {
	initBall();
});
$(window).on('loading_show', function () {
	initLoading();
});
$(window).on('index_show', function () {
	initRain();
});
$(window).on('rain_show', function () {
	initRain();
});

if(process.env.NODE_ENV == 'development'){
	function match(str) {
		if (window.location.href.indexOf(str+'_test') > -1) {
			$(window).trigger(`${str}_show`);
		}
	}
	//initRain();
	match('loading');
	match('ball');
	match('stage');
	match('index');
	if (window.location.pathname.indexOf('index') > -1) {
		initRain();
	}
} else {
	initRain();
}

