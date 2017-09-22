import { getState } from '../../../state';
import { Visualizer } from '../Visualizer';

const touchingCls = 'm-btn-touching';

let source,audioBuffer;

export function iOSLoad(btn, src) {
	const $btn = $(btn);
	$btn.css('display', 'none');
	getState().audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	const xhr = new XMLHttpRequest();
	xhr.open('GET', src, true);
	xhr.responseType = 'arraybuffer';
	xhr.onload = function () {
		const responseBuffer = xhr.response;
		$btn.css('display', 'block');
		getState().audioCtx.decodeAudioData(responseBuffer, function (buffer) {
			afterLoad(buffer, $btn);
		});
	};
	xhr.send();
}

function firstPlay(buffer) {
	source = getState().audioCtx.createBufferSource();
	source.buffer = buffer;
	source.connect(getState().audioCtx.destination);
	source.loop = true;
	if (!source.start) {
		source.start = source.noteOn; //in old browsers use noteOn method
		source.stop = source.noteOff; //in old browsers use noteOn method
	}
	source.start(0);
	getState().paused = false;
	new Visualizer().init(getState().audioCtx, source);
	source.onended = function () {};
}

function afterLoad(buffer, $btn) {
	firstPlay(buffer);
	$btn.toggleClass('m-pause-btn');
	const ontouchstart = ($btn, btn) => (ev) => {

		ev.preventDefault();
		$btn.addClass(touchingCls);
		btn.touching = true;

		setTimeout(function () {
			if (btn.touching) {
				btn.touching = false;
				$btn.removeClass(touchingCls);
			}
		}, 500);
	};

	const ontouchend = ($btn, btn) => (ev) => {
		ev && ev.preventDefault();
		if (!source) {
			firstPlay(buffer);
		} else {
			if (getState().paused) {
				source.context.resume();
			} else {
				source.context.suspend();
			}
			getState().paused = !getState().paused;
		}
		$btn.toggleClass('m-pause-btn');
	};

	$btn.on('touchstart', ontouchstart($btn, $btn.get(0)));
	$btn.on('touchend', ontouchend($btn, $btn.get(0)));
}

export function clearContext() {
	getState().audioCtx && getState().audioCtx.close().then(function () {
		getState().paused = true;
		source = null;
		getState().audioCtx = null;
		audioBuffer = null;
	});
	//source && source.context.close().then(function () {
	//	getState().paused = true;
	//	source = null;
	//	getState().audioCtx = null;
	//	audioBuffer = null;
	//});
}
