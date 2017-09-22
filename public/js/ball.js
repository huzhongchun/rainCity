(function () {

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

	function initBall() {
		var BALL_SIZE = 370, HALF_SIZE = BALL_SIZE / 2, INNER_SIZE = 280,
		    HALF_INNER_SIZE                                        = INNER_SIZE / 2;
		var touching = false;
		var ballsMaterial = $('.cell .ball .inner-material');
		var ball = $('#ball');
		var innerBall = $('.ball', ball);
		var foreground = $('#foreground');
		var allowMoving = false;

		function bindMove(ev) {
			ev.preventDefault();
			if (touching) return;
			var data = ev.touches ? ev.touches[0] : ev;
			var x = data.pageX;
			var y = data.pageY;

			var width = window.innerWidth, height = window.innerHeight;
			var left_p = per(x / width), top_p = per(y / height);
			var t_left = -left_p * HALF_INNER_SIZE + 'px', t_top = -top_p * HALF_INNER_SIZE + 'px';
			ballsMaterial.css('transform', 'translate(' + t_left + ',' + t_top + ')');
			innerBall.css('box-shadow', '' + (left_p - 0.5) * 10 + 'px ' + (top_p - 0.5) * 10 + 'px 100px 35px rgba(226, 211, 23,0.7);');
		}

		//		$(window).on('mousemove', bindMove);
		//		$(window).on('touchmove', bindMove);
		$(window).on('touchstart', function (ev) {
			ev.preventDefault();
		});

		var ballTouch = function (ev) {
			allowMoving = false;
			ev && ev.preventDefault();
			touching = true;
			$('.cell').addClass('light');
			foreground.addClass('light');
			setTimeout(function () {
				window.location.href = '/stage.html';
			}, 4000);
		};
		ball.on('touchstart', ballTouch);

		ball.on('touchend', function () {
			touching = false;
		});

		foreground.on('touchstart', function (ev) {
			var data = ev.touches ? ev.touches[0] : ev;
			var x = data.pageX;
			var y = data.pageY;
			var rect = ball.get(0).getBoundingClientRect();
			if (x.between(rect.left, rect.left + rect.width) && y.between(rect.top, rect.top + rect.height)) {
				ballTouch();
			}
		});
		var _lon, _lat, _b, dlon = 0, dlat = 0, db = 0;
		var inited = false;
		var func = function (t) {
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
			if (!allowMoving) {return;}
			var left_p = Math.sin(Math.PI * dlon / 180), top_p = Math.pow((dlat + 90) / 180, 0.3) - 1;
			var t_left = -left_p * HALF_INNER_SIZE - HALF_INNER_SIZE + 'px',
			    t_top  = top_p * HALF_INNER_SIZE - HALF_INNER_SIZE + 'px';
			ballsMaterial.css('transform', 'translate(' + t_left + ',' + t_top + ')');
			ball.css('transform', 'translate(' + (-HALF_SIZE + left_p * 80) + 'px, ' + (-HALF_SIZE + (db / 90) * 80 ) + 'px)');
			innerBall.css('box-shadow', '' + (left_p - 0.5) * 10 + 'px ' + (top_p - 0.5) * 10 + 'px 70px 12px rgba(249, 238, 102,1);');
		};
		var g = new Orienter({
			onOrient: func
		});
		g.init();
		ball.css('transition', 'opacity ease-out 1s');
		setTimeout(function () {
			ball.css({ 'opacity': 1, 'transition': 'none' });
			setTimeout(function () {
				allowMoving = true;
			}, 1000);
		}, 1000);
	}

	initBall();
})();