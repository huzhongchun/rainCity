import {loadAudio} from '../bgm';
import {getState} from '../state';
const urls = [];
const w = window.innerWidth, h = window.innerHeight;
const videoWidth = 320,videoHeight = 504;
const rate = videoWidth/videoHeight,clientRate = w/h;
let left = 0, top = 0;
var shallRenderWidth = videoWidth,shallRenderHeight = videoHeight;
shallRenderWidth = rate * h * (videoWidth/w);
if(shallRenderWidth < videoWidth) {
	shallRenderWidth = videoWidth;
	shallRenderHeight = (w / rate) * (videoHeight/h);
	top = (videoHeight - shallRenderHeight)/2;
} else {
	shallRenderHeight = videoHeight;
	shallRenderWidth = (h * rate) * (videoWidth/w);
	left = (videoWidth - shallRenderWidth)/2;
}
function draw() {
	console.log(top,left,shallRenderWidth,shallRenderHeight);

	//remove broken frame
	const frames = urls.filter(x => x);
	const c = $('#root .video').get(0);
	c.className += ' playing';
	const ctx = c.getContext('2d');
	const len = frames.length;
	let i = 0;

	const s = setInterval(function () {
		i++;
		if(frames[i]) {
			const image = new Image();
			image.onload = function () {
				ctx.drawImage(image, left, top, shallRenderWidth, shallRenderHeight);
			};
			image.onerror = function(){
				debugger;
			};
			image.src = frames[i];
		}
		if (i >= len) {
			$(window).trigger('ball_show');
			clearInterval(s);
		}
	}, 1000/24);
}

const genUrl = (URL || webkitURL).createObjectURL;

export function parseImages(zip) {

	getState().current = 2;
	const url = process.env.CDN_PREFIX + '/media/bgm_rain.mp3';
	loadAudio(url);

	let loaded = 0;
	const len = _.size(zip.files) - 1;
	for (var name in zip.files) {
		if (name !== 'video/') {
			const index = name.match(/\d+/)[0] - 0 - 1;
			const file = zip.files[name];
			((i) => file.async('blob').then(res => {
				loaded++;
				urls[i] = genUrl(res);
				if (loaded >= len) {
					draw();
				}
			}).catch(e => {
				console.error(e);
				loaded++;
				if (loaded >= len) {
					draw();

				}

			}))(index);
		}
	}
}
