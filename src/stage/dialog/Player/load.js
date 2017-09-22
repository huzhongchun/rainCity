import { getState } from '../../../state';
import { Visualizer } from '../Visualizer';

export function load(btn, src) {
	const touchingCls = 'm-btn-touching';
	getState().audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	let source;
	let gainNode;
	const myAudio = createAudio(src);
	const $btn = $(btn);

	function firstPlay() {
		source = getState().audioCtx.createMediaElementSource(myAudio);
		gainNode = getState().audioCtx.createGain();
		source.connect(gainNode);
		gainNode.connect(getState().audioCtx.destination);

		new Visualizer().init(getState().audioCtx, source);
	}

	btn.ontouchstart = function (ev) {
		ev.preventDefault();
		$btn.addClass(touchingCls);
		btn.touching = true;

		setTimeout(function () {
			if (btn.touching) {
				btn.touching = false;
				$btn.removeClass(touchingCls);
			}
		}, 700);

	};

	btn.ontouchend = function (ev) {
		ev && ev.preventDefault();
		if (!source) {
			firstPlay();
		}
		myAudio.paused ? myAudio.play() : myAudio.pause();
		getState().paused = myAudio.paused;
		$btn.toggleClass('m-pause-btn');
	};

	myAudio.onended = function () {
		$btn && $btn.addClass('m-pause-btn');
		getState().paused = true;
	};

	myAudio.addEventListener('canplaythrough', function () {
		//myAudio.play();
		if (!source && !myAudio.paused) {
			firstPlay();
			//paused = false;
		}
	}, false);
	myAudio.load();
}

function createAudio(src) {
	const audio = document.createElement('audio');
	audio.setAttribute('loop', 'true');
	const sourceNode = document.createElement('source');
	sourceNode.setAttribute('src', src);
	audio.appendChild(sourceNode);
	document.body.appendChild(audio);

	//add event
	audio.volume = 1;
	return audio;
}