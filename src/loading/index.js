import { imageBlob, imageURL } from '../utils/loadImageBlob';
import { loadCss } from '../utils/loadCss';
import { loadVideoFunc } from './video';
import { loadingFunc } from './progress';
import { loadImagesFunc } from './loadImages';
import { bodyStr ,svg} from './body';
import {playBGM} from '../bgm';
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

function preloadLoadingPageImages(next) {
	const len = 2;
	let loaded = 0;
	const cb = function () {
		loaded++;
		if (loaded >= len) {
			//setTimeout(function () {
				//document.body.className += ' show';
				//document.body.style.opacity = '1';
				next && next();
				//alert('loaded');
			//}, 1000);
		}
	};
	imageBlob('/images/loading/mask.png', cb);
	imageBlob('/images/loading/bg.png', cb);
}

export function initLoading() {
	//document.body.style.opacity = '0';
	preloadLoadingPageImages(function(){
		document.body.className = 'loading-body';
		$('#root').html(bodyStr);
        $('#root .mask').css('background-image',`url(${imageURL('/images/loading/mask.png')})`);
		const loading = loadingFunc();
		const loadVideo = loadVideoFunc(loading);
		const loadImages = loadImagesFunc(loading, loadVideo);
		loadImages();
		setTimeout(function(){
            $('body').addClass('hide-bg');
			$('#root .wrap-box').append(svg);
		},300);
		playBGM();
	});



	//loadCss('/css/loading.css',function(){
	//});
}