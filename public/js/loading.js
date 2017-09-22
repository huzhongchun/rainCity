(function () {

	var wrap = document.getElementById('wrap');

	var text = document.getElementById('text');
	var hasLoading = false;

	function loading(percent) {
		console.log(percent);
		if (!hasLoading) {
			wrap.classList.add('loading');
			hasLoading = true;
		}
		wrap.style.transform = 'translateY(' + (-70 + (420 * (100 - percent) / 100)) + 'px)';
		if (percent >= 100) {
			wrap.className += ' stop';
			text.innerHTML = '轻触以继续';
		} else {
			text.innerHTML = percent < 10 ? 0 + '' + percent.toFixed(2) + '%' : percent.toFixed(2) + '%';
		}
	}

	//var loading = _.throttle(loadingFunc, 100);
	var p = 0;
	window.addEventListener('touchstart', function (ev) {
		ev.preventDefault();
	});

	function requestImage(url, cb) {
		setTimeout(function(){
			var img = new Image();
			if(cb) {
				img.onload = cb;
			}
			img.src = url;
		},0);
	}

	function requestImages() {

		var len = 2;
		var loaded = 0;
		var cb = function () {
			loaded++;
			if (loaded >= len) {
				setTimeout(function () {
					document.body.className += ' show';
					//loadVideo('/v.mp4');
					loadImages();
				}, 1000);
			}
		};

		requestImage('/images/loading/mask.png', cb);
		requestImage('/images/loading/bg.png', cb);
	}

	function loadImages() {

		var images = _.range(0, 20)
		.map(function (x) {
			return '/images/stage/skybox/' + x + '.jpg';
		})
		.concat(rainDrops.map(function (x) {
			return '/images/stage/drops/' + x.file + '.png';
		}))
		.concat([
			'/images/ball/ball.png',
			'/images/ball/ball_fg.png',
			'/images/ball/ball_bg.png'
		]);
		var len = images.length;
		var loaded = 0;
		var cb = function () {
			loaded++;
			loading(50 * loaded / len);
			if (loaded >= len) {
				loadVideo('http://wungcqrain.oss-cn-beijing.aliyuncs.com/v.mp4');
			}
		};
		images.forEach(function(url,i){
			var s = setTimeout(function () {
				requestImage(url,cb);
				clearTimeout(s);
			},i*100);
		})
	}

	function loadVideo(src) {

		var req = new XMLHttpRequest();
		req.open('GET', src, true);
		req.responseType = 'blob';
		req.onprogress = function (progressEvent) {
			var progress = 0.5 + 0.5 * (progressEvent.loaded / progressEvent.total);
			console.log(progress);
			loading(progress * 100);
		};
		req.onload = function () {
			// Onload is triggered even on 404
			// so we need to check the status code
			if (this.status === 200) {
				var videoBlob = this.response;
				var vid = URL.createObjectURL(videoBlob); // IE10+
				// Video is now downloaded
				// and we can set it as source on the video element
				showVideo(vid);

			}
		};
		req.onerror = function () {
			// Error
		};

		req.send();
	}

	function showVideo(src) {
		var played = false;

		var video = document.createElement('video');
		video.setAttribute('playsinline', 'true');
		video.setAttribute('width', window.innerWidth);
		video.setAttribute('height', window.innerHeight);
		document.body.appendChild(video);
		video.addEventListener('loadeddata', function () {
			console.log(video);
			//			debugger;
		});
		video.addEventListener('canplay', function () {
			//			debugger;
			video.play();
		});
		video.addEventListener('touchstart', function () {
			if (!played) {
				hideBg();
				video.classList.add('playing');
				video.play();
				played = true;
			}

		});
		video.onended = function () {
			video.classList.add('playing');
			setTimeout(function () {
				window.location.href = '/ball.html';
			}, 100);
		};
		video.src = src;
		video.load();
	}

	function hideBg() {
		document.body.removeChild(document.getElementById('loading_wrap'));
		document.body.removeChild(document.getElementById('loading_mask'));
	}

	function hideVideo(src) {

	}

	setTimeout(function () {
		requestImages();
	}, 0);

})();
