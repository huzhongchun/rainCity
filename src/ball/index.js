import { bodyStr } from './body';
import { shine } from './shine';
import { loadCss } from '../utils/loadCss';
import { playBGM } from '../bgm';

const BALL_SIZE = 370, HALF_SIZE = BALL_SIZE / 2;
const INNER_SIZE = 280, HALF_INNER_SIZE = INNER_SIZE / 2;

export function initBall() {
	document.body.className = 'ball-body';
	$('#root').html(bodyStr);
	//loadCss('/css/ball.css',init);
	init();
	playBGM();
}

function per(x) {
	if (x < 0) {
		return 0;
	} else if (x > 1) {
		return 1;
	} else {
		return x;
	}
}

Number.prototype.between = function (a, b) {
	return (this >= a && this <= b);
};

function init() {

	let touching = false;
	//const ballsMaterial = $('.cell .ball .inner-material');
	const ball = $('#ball');
	//const innerBall = $('.ball', ball);
	const foreground = $('#foreground');
	const rain = $('#rain_foreground');
	let allowMoving = false;

	$(window).on('touchstart', function (ev) {
		ev.preventDefault();
	});

	const ballTouch = function (ev) {
		allowMoving = false;
		ev && ev.preventDefault();
		touching = true;
		$('#rain_foreground').removeClass('ready');
		var x = ball.offset().left + HALF_SIZE, y = ball.offset().top + HALF_SIZE;
		shine(x, y, function () {
			$(window).trigger('stage_show');
		});
		// $('.cell').addClass('light');
		foreground.addClass('light');
		// $('#rain_foreground').removeClass('ready');
		// setTimeout(function(){
		// 	$('body').addClass('fade');
		// },1500);
		// setTimeout(function () {
		// 	$(window).trigger('stage_show');
		//
		// }, 4000);
	};
	ball.on('touchstart', ballTouch);

	ball.on('touchend', function () {
		touching = false;
	});

	rain.on('touchstart', function (ev) {
		const data = ev.touches ? ev.touches[0] : ev;
		const x = data.pageX;
		const y = data.pageY;
		const { left, top, height, width } = ball.get(0).getBoundingClientRect();
		if (x.between(left, left + width) && y.between(top, top + height)) {
			ballTouch();
		}
	});
	let _lon, _lat, _b, dlon = 0, dlat = 0, db = 0;
	let inited = false;
	//const log = createLogger();
	const func = function (t) {
		if (!allowMoving) {return;}
		if (!inited) {
			_lon = t.lon;
			_lat = t.lat;
			_b = t.b;
			inited = true;
		} else {
			dlon = t.lon - _lon;
			dlat = t.lat - _lat;
			db = t.b - _b;
		}
		const left_p = Math.sin(Math.PI * dlon / 180), top_p = Math.pow((dlat + 90) / 180, 0.3) - 1;
		// const t_left = -left_p * HALF_INNER_SIZE - HALF_INNER_SIZE + 'px',
		//       t_top  = top_p * HALF_INNER_SIZE - HALF_INNER_SIZE + 'px';
		//ballsMaterial.css('transform', `translate(${t_left},${t_top})`);
		const style = `translate(${(-HALF_SIZE + left_p * 80)}px,${(-HALF_SIZE + ((Math.sin( db * Math.PI / 180))) * 80 )}px)`;
		ball.css('transform', style);
		//log(style);
		//innerBall.css('box-shadow', '' + (left_p - 0.5) * 10 + 'px ' + (top_p - 0.5) * 10 + 'px 70px 30px rgba(249, 238, 102,1);');
	};
	const g = new Orienter({
		onOrient: _.throttle(func, 16)
	});
	g.init();
	setTimeout(function () {
		allowMoving = true;
	}, 0);
}

function createLogger() {
	let wrap;
	return function (str) {
		if (!wrap) {
			wrap = document.createElement('div');
			wrap.style.display = 'block';
			wrap.style.position = 'fixed';
			wrap.style.zIndex = '100000';
			wrap.style.top = 0;
			wrap.style.right = 0;
			wrap.style.backgroundColor = 'rgba(0,0,0,.7)';
			wrap.style.width = '100vw';
			wrap.style.padding = '40px';
			wrap.style.color = '#fff';
			wrap.style.fontSize = '16px';
			document.body.appendChild(wrap);
		}
		wrap.innerHTML = str;
	};
}