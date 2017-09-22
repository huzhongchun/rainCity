import { imageBlob, imageURL } from '../utils/loadImageBlob';
import { loadCss } from '../utils/loadCss';
import { loadVideoFunc } from './video';
import { loadingFunc } from './progress';
import { loadImagesFunc } from './loadImages';
import { bodyStr } from './body';

//var loading = _.throttle(loadingFunc, 100);

function requestImage(url, cb) {
	setTimeout(function () {
		const img = new Image();
		if (cb) {
			img.onload = cb;
		}
		img.src = url;
	}, 0);
}

function preloadLoadingPageImages(loadImages) {
	const len = 2;
	let loaded = 0;
	const cb = function () {
		loaded++;
		if (loaded >= len) {
			setTimeout(function () {
				//document.body.className += ' show';
				//document.body.style.opacity = '1';
				loadImages();
			}, 1000);
		}
	};
	imageBlob('/images/loading/mask.png', cb);
	imageBlob('/images/loading/bg.png', cb);
}

export function initLoading() {
	//document.body.style.opacity = '0';
	document.body.className = 'loading-body';
	$('#root').html(bodyStr);
	const loading = loadingFunc();
	const loadVideo = loadVideoFunc(loading);
	const loadImages = loadImagesFunc(loading, loadVideo);
	loadImages();
	//preloadLoadingPageImages(loadImages);

	//loadCss('/css/loading.css',function(){
	//});
}