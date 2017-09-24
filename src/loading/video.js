import JSZip from 'jszip';
import { parseImages } from './zipVideo';
import { loadAudio } from '../bgm';

function hideBg() {
	$('#loading_wrap').remove();
	$('#loading_mask').remove();
}

function showVideo(src) {
	let played = false;
	const video = document.createElement('video');
	video.setAttribute('playsinline', 'true');
	video.setAttribute('webkit-playsinline', 'true');
	video.controls = false;
	video.setAttribute('x5-video-player-type', 'h5');
	video.setAttribute('x5-video-player-fullscreen', 'true');
	video.setAttribute('width', window.innerWidth);
	video.setAttribute('height', window.innerHeight);
	document.getElementById('root').appendChild(video);

	const doPlayVideo = function () {
		if (!played) {
			hideBg();
			video.classList.add('playing');
			video.play();
			played = true;
		}
	};
	const playVideo = function () {
		if (window.WeixinJSBridge) {
			WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
				doPlayVideo();
			}, false);
			document.addEventListener('WeixinJSBridgeReady', function () {
				WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
					doPlayVideo();
				});
			}, false);
		} else {
			doPlayVideo();
		}
	};
	var touchFunc = function () {
		playVideo();

		document.body.removeEventListener('touchstart', touchFunc);
	};
	video.addEventListener('canplay', playVideo);
	video.addEventListener('touchstart', playVideo);
	//document.body.addEventListener('touchstart', touchFunc);
	video.onended = function () {
		video.classList.add('playing');
		$(window).trigger('ball_show');
	};
	video.onerror = function (e) {
		console.error(JSON.stringify(arguments));
	};
	video.src = src;
	video.load();
	playVideo();
}

export const loadVideoFunc = loading => src => {
	//const req = new XMLHttpRequest();
	//req.open('GET', src, true);
	//req.responseType = 'blob';
	//req.onprogress = function (progressEvent) {
	//	const progress = 0.5 + 0.5 * (progressEvent.loaded / progressEvent.total);
	//	loading(progress * 100);
	//};
	//req.onload = function () {
	//	if (this.status >= 200 && this.status < 400) {
	//		const videoBlob = this.response;
	//		const url = (URL || webkitURL).createObjectURL(videoBlob); // IE10+
	//		showVideo(url);
	//	}
	//};
	//req.send();
	loadZip(loading, src);
};

function loadZip(loading, src) {
	const req = new XMLHttpRequest();
	req.open('GET', src, true);
	req.responseType = 'blob';
	req.onprogress = function (progressEvent) {
		const progress = 0.5 + 0.5 * (progressEvent.loaded / progressEvent.total);
		loading(progress * 100);
	};
	req.onload = function () {
		loading(100);
		if (this.status >= 200 && this.status < 400) {
			addCanvas();
			const new_zip = new JSZip();
			new_zip.loadAsync(req.response)
			.then(function (zip) {
				parseImages(zip);
			});

		}
	};
	req.send();
}

function addCanvas() {
	const c = document.createElement('canvas');
	c.setAttribute('width', 320);
	c.setAttribute('height', 504);
	c.className = 'video';
	$('#root').get(0).appendChild(c);
}