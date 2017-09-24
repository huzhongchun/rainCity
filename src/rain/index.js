import { bodyStr } from './body';
import { getMap } from './baiduMap';
import { initPage } from './rain';
import { requestImage } from '../utils/loadImageBlob';
import {playBGM} from '../bgm';

export function initRain() {
	window.addEventListener('touchstart', function (ev) {
		ev.preventDefault();
	});
	document.body.className = 'rain-body';
	$('#root').html(bodyStr);
	$('#nav_left').on('touchend', getMap);
	$('#nav_right').on('touchend', goLoading);
	initPage();
	// playAudio();
	requestImage('/images/loading/mask.png');
	requestImage('/images/loading/bg.png');
	setTimeout(playBGM,1000);
	//playBGM();
}

function goLoading() {
	$(window).trigger('loading_show');
}
