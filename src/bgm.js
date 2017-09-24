import { getState } from './state';

function autoPlayAudio(src) {
	let played = false;
	const audio = document.createElement('audio');
	audio.setAttribute('preload', 'true');
	audio.setAttribute('loop', 'true');
	audio.setAttribute('autoPlay', 'true');
	audio.id = 'bgm';
	document.body.appendChild(audio);

	const doPlay = function () {
		audio.volume = 1;
		audio.play();
		played = true;
	};
	const playAudioFunc = function (ev) {
		ev && ev.preventDefault();
		if (window.WeixinJSBridge) {
			WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
				doPlay();
			}, false);
			document.addEventListener('WeixinJSBridgeReady', function () {
				WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
					doPlay();
				});
			}, false);
		} else {
			doPlay();
		}

	};
	const touchFunc = function () {
		playAudioFunc();
		document.body.removeEventListener('touchstart', touchFunc);
	};
	audio.addEventListener('canplay', playAudioFunc);
	//document.body.addEventListener('touchstart', touchFunc);
	audio.onended = function () {
		audio.classList.add('playing');
		$(window).trigger('ball_show');
	};
	audio.src = src;
	audio.load();
	playAudioFunc();
}

function doPlayAudio(audio) {
	if (window.WeixinJSBridge) {
		WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
			audio.play();
		}, false);
		document.addEventListener('WeixinJSBridgeReady', function () {
			WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
				audio.play();
			});
		}, false);
	} else {
		audio.play();
	}
}

export const loadAudio = src => {
	const req = new XMLHttpRequest();
	req.open('GET', src, true);
	req.responseType = 'blob';
	req.onload = function () {
		if (this.status >= 200 && this.status < 400) {
			const videoBlob = this.response;
			const url = (URL || webkitURL).createObjectURL(videoBlob); // IE10+
			if (getState().current == 1 || getState().current == 3) {

			} else {
				autoPlayAudio(url);
			}
		}
	};
	req.send();
};

export function clearContext() {
	getState().audioCtx && getState().audioCtx.close().then(function () {
		getState().paused = true;
		getState().audioCtx = null;
	});
}

export function playBGM() {
	clearContext();
	const cur = getState().current - 0;
	if (cur == 0) {
		if (!document.getElementById('bgm')) {
			const url = process.env.CDN_PREFIX + '/media/bgm_rain.mp3';
			loadAudio(url);
		}
	} else if (cur == 1) {
		$('#bgm').remove();
		$('#bgm').remove();
		//const url = process.env.CDN_PREFIX + '/media/bgm.mp3';
		//loadAudio(url);
	} else if (cur == 2) {
		if (!document.getElementById('bgm')) {
			const url = process.env.CDN_PREFIX + '/media/bgm_rain.mp3';
			loadAudio(url);
		}
	}

}
