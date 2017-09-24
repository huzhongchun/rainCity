import {getState} from '../../state';
CanvasRenderingContext2D.prototype.drawRoundRect = function (x, y, w, h, r) {
	if (w < 2 * r) {r = w / 2;}
	if (h < 2 * r) { r = h / 2;}
	this.beginPath();
	this.moveTo(x + r, y);
	this.arcTo(x + w, y, x + w, y + h, r);
	this.arcTo(x + w, y + h, x, y + h, r);
	this.arcTo(x, y + h, x, y, r);
	this.arcTo(x, y, x + w, y, r);
	this.fill();
	this.closePath();
	return this;
};
let ctx;
export class Visualizer {

	file = null;
	fileName = null;
	audioContext = null;
	source = null;
	forceStop = false;

	constructor() {

	}

	init(ctx, source) {
		this.prepareAPI(ctx);
		this.start(ctx, source);
	}

	prepareAPI(ctx) {
		//fix browser vender for AudioContext and requestAnimationFrame
		window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
		try {
			this.audioContext = ctx;
		} catch (e) {
			console.log(e);
		}
	}

	start(ctx, source) {
		//read and decode the file into audio array buffer
		this.visualize(ctx, source);
	}

	visualize(audioContext, source, buffer) {
		const analyser = audioContext.createAnalyser();
		//connect the source to the analyser
		source.connect(analyser);
		//connect the analyser to the destination(the speaker), or we won't hear the sound
		analyser.connect(audioContext.destination);

		//stop the previous sound if any
		if (this.source !== null) {
			this.forceStop = true;
			this.source.stop(0);
		}
		this.source = source;
		this.drawSpectrum(analyser);
	}

	drawSpectrum(analyser) {

		const canvas            = document.getElementById('canvas'),
		      h                 = canvas.height,
		      cwidth            = canvas.width,
		      cheight           = canvas.height - 20,
		      center_y          = canvas.height / 2,
		      meterWidth        = 4 * 2, //width of the meters in the spectrum
		      gap               = 10 * 2, //gap between meters
		      capHeight         = 20,
		      leftPadding       = 26 * 2,
		      capStyle          = '#fff',
		      meterNum          = 200 / (10 + 2), //count of the meters
		      capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
		ctx = canvas.getContext('2d');
		ctx.fillStyle = '#fff';
		let last = Date.now();
		const audio = document.querySelector('audio');
		const drawMeter = function () {
			//到达频率 并且未暂停
			if (Date.now() - last >= 100 && !getState().paused) {
				last = Date.now();

				const arr = new Uint8Array(analyser.frequencyBinCount);
				analyser.getByteTimeDomainData(arr);
				const step = Math.round(arr.length / meterNum); //sample limited data from the total array
				ctx.clearRect(0, 0, cwidth, h);
				for (var i = 0; i < meterNum; i++) {
					var value = Math.pow(arr[i * step] / 200, 2) * cheight;
					ctx.fillRect(leftPadding + i * (meterWidth + gap), center_y - value / 2 /*2 is the gap between meter and cap*/, meterWidth, value); //the meter
				}
			}
			requestAnimationFrame(drawMeter);
		};
		drawMeter();
	}
}