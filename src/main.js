import { init as initStage } from './stage';
import { initBall } from './ball';
import { initLoading } from './loading';
import { initRain } from './rain';
import { getState } from './state';
import './style/main.less';
if (process.env.NODE_ENV != 'development') {
	window.location.hash = '#';
}
const pathname = window.location.pathname;

$(window).on('stage_show', function () {
	getState().current = 4;
	initStage();
});
$(window).on('ball_show', function () {
	getState().current = 3;
	initBall();
});
$(window).on('loading_show', function () {
	window.location.hash = '#1';
	getState().current = 1;
	//alert('inited');
	initLoading();
});
$(window).on('index_show', function () {
	getState().current = 0;
	window.location.hash = '#0';
	initRain();
});
$(window).on('rain_show', function () {
	getState().current = 0;
	window.location.hash = '#0';
	initRain();
});

if (process.env.NODE_ENV == 'development') {
	function match(str) {
		if (window.location.href.indexOf(str + '_test') > -1) {
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
	const { hash } = window.location;
	//if (hash == '#1') {
	//	initLoading();
	//} else {
	//	initRain();
	//}
} else {
	const { hash } = window.location;
	if (hash == '#1') {
		initLoading();
	} else {
		initRain();
	}
}
var old_hash = window.location.hash + '';
setInterval(function () {
	if (window.location.hash != old_hash) {
		old_hash = window.location.hash + '';
		window.onhashchange();
	}
}, 100);

window.onhashchange = function () {
	const [foo, hash = '0'] = window.location.hash.split('#');
	const current = getState().current;
	if (hash == current) return;
	if (current != 4) return;
	if (hash == 0) {
		//alert('change 0');
		initRain();
	} else if (hash == 1) {
		//alert('change 1');
		initLoading();
	} else if (hash == 3) {
		initBall();
	} else if (hash == 4) {
		initStage();
	}
};
//alert(window.location.hash);
//alert(window.location.pathname);