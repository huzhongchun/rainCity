import { loading } from './load';
import { generateStyle } from './generateStyle';
import { initScene } from './scene';
import { bodyStr } from './body';
import { loadCss } from '../utils/loadCss';

export function init() {
	document.body.className = 'stage-body';
	$('#root').html(bodyStr);
	generateStyle();
	//loadCss('/css/stage.css',function(){
	//	loadCss('/css/dialog.css',function(){
	//		//loading();
	//		initScene();
	//	})
	//});
	initScene();
	stopAudio();
}
function stopAudio(){
	const audio = document.getElementById('bgm');
	if(!audio) return;
	let t = 10;
	const s = setInterval(function () {
		t--;
		audio.volume -= 0.1;
		if (t === 0) {
			clearInterval(s);
			audio.pause();
			$(audio).remove();
		}
	},200);
}