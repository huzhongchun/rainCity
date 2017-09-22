/*
*An audio spectrum visualizer built with HTML5 Audio API
*Author:Wayou
*License:feel free to use but keep this info please!
*Feb 15 2014
*Need support you can :
*view the project page:https://github.com/Wayou/HTML5_Audio_Visualizer/
*view online demo:http://wayouliu.duapp.com/mess/audio_visualizer.html
*or contact me:liuwayong@gmail.com
*/
var showDialog = null;

var dropTypes = [
	'七星湾',
	'三潭映月',
	'东方明珠',
	'中俄边境石',
	'九仙山',
	'加蓬',
	'哥斯达黎加国旗',
	'地王大厦',
	'大理三塔',
	'孔子',
	'宏村',
	'小笼汤包',
	'少林寺',
	'山',
	'意大利',
	'新疆花帽',
	'日本',
	'泰国',
	'滕王阁',
	'火锅',
	'烤鸭',
	'热干面',
	'瑞典',
	'缅甸',
	'美国',
	'英国',
	'草原',
	'透明',
	'韩国',
	'风',
	'鸟巢'
];
(function () {
	var source = null;
	var audioBuffer = null;
	var paused = true;
	var audioCtx;
	var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
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
	var Visualizer = function () {
		this.file = null, //the current file
			this.fileName = null, //the current file name
			this.audioContext = null,
			this.source = null, //the audio source
			this.forceStop = false;
	};
	Visualizer.prototype = {
		ini: function (ctx, source) {
			this._prepareAPI(ctx);
			this._start(ctx, source);
		},
		_prepareAPI: function (ctx) {
			var that = this;
			//fix browser vender for AudioContext and requestAnimationFrame
			window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
			window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
			try {
				this.audioContext = ctx;
			} catch (e) {
				console.log(e);
			}
		},
		_start: function (ctx, source) {
			//read and decode the file into audio array buffer
			var that = this;
			that.visualize(ctx, source);

		},
		_visualize: function (audioContext, source, buffer) {
			var analyser = audioContext.createAnalyser(),
			    that     = this;
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
			this._drawSpectrum(analyser);
		},
		_drawSpectrum: function (analyser) {

			var canvas            = document.getElementById('canvas'),
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
			var last = Date.now();
			var audio = document.querySelector('audio');
			var drawMeter = function () {
				//到达频率 并且未暂停
				if (Date.now() - last >= 100 && !paused) {
					last = Date.now();
					//var array = new Uint8Array(analyser.frequencyBinCount);
					//analyser.getByteFrequencyData(array);
					var arr = new Uint8Array(analyser.frequencyBinCount);
					analyser.getByteTimeDomainData(arr);
					var step = Math.round(arr.length / meterNum); //sample limited data from the total array
					ctx.clearRect(0, 0, cwidth, h);
					for (var i = 0; i < meterNum; i++) {
						var value = Math.pow(arr[i * step] / 200, 2) * cheight;
						//ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
						ctx.fillRect(leftPadding + i * (meterWidth + gap), center_y - value / 2 /*2 is the gap between meter and cap*/, meterWidth, value); //the meter
						//ctx.drawRoundRect(leftPadding + i * (meterWidth + gap), center_y - value / 2, meterWidth, value, 5);
					}
				}

				requestAnimationFrame(drawMeter);
			};
			drawMeter();
		}
	};

	function load(btn, src) {
		var touchingCls = 'm-btn-touching';
		audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		var source;
		var gainNode;
		var myAudio = document.createElement('audio');
		myAudio.setAttribute('loop', 'true');
		var sourceNode = document.createElement('source');
		sourceNode.setAttribute('src', src);
		myAudio.appendChild(sourceNode);
		document.body.appendChild(myAudio);

		//add event
		myAudio.volume = 1;
		var $btn = $(btn);

		function firstPlay() {
			source = audioCtx.createMediaElementSource(myAudio);
			gainNode = audioCtx.createGain();
			source.connect(gainNode);
			gainNode.connect(audioCtx.destination);

			new Visualizer().init(audioCtx, source);
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
			paused = myAudio.paused;
			$btn.toggleClass('m-pause-btn');
		};
		myAudio.onended = function () {
			$btn && $btn.addClass('m-pause-btn');
			paused = true;
			//debugger;
			//myAudio.play();
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

	function iOSLoad(btn, src) {
		var touchingCls = 'm-btn-touching';
		var source;
		var gainNode;
		var $btn = $(btn);
		$btn.css('display', 'none');
		audioCtx = new (window.AudioContext || window.webkitAudioContext)();

		var xhr = new XMLHttpRequest();
		xhr.open('GET', src, true);

		xhr.responseType = 'arraybuffer';
		var responseBuffer;

		function afterLoad(buffer) {
			function firstPlay() {
				source = audioCtx.createBufferSource();
				source.buffer = buffer;
				source.connect(audioCtx.destination);
				source.loop = true;
				if (!source.start) {
					source.start = source.noteOn; //in old browsers use noteOn method
					source.stop = source.noteOff; //in old browsers use noteOn method
				}
				source.start(0);
				paused = false;
				new Visualizer().init(audioCtx, source);
				source.onended = function () {
					//paused = true;
					//$btn.removeClass('m-pause-btn');
					//audioCtx = new (window.AudioContext || window.webkitAudioContext)();
					//afterLoad(buffer);
				};
			}

			var ontouchstart = function (ev) {
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

			var ontouchend = function (ev) {
				ev && ev.preventDefault();
				if (!source) {
					firstPlay();
				} else {
					if (paused) {
						source.context.resume();
					} else {
						source.context.suspend();
					}
					paused = !paused;
				}
				//myAudio.paused ? myAudio.play() : myAudio.pause();
				//paused = myAudio.paused;

				$btn.toggleClass('m-pause-btn');
			};

			$btn.on('touchstart', ontouchstart);
			$btn.on('touchend', ontouchend);

		}

		xhr.onload = function () {
			responseBuffer = xhr.response;
			/* arraybuffer 可以在 xhr.response 访问到 */
			$btn.css('display', 'block');
			audioCtx.decodeAudioData(responseBuffer, afterLoad);
		};
		xhr.send();
	}

	if (isiOS) {
		load = iOSLoad;
	}

	function clearContext() {
		audioCtx && audioCtx.close().then(function () {
			paused = true;
			source = null;
			audioCtx = null;
			audioBuffer = null;
		});
		source && source.context.close().then(function () {
			paused = true;
			source = null;
			audioCtx = null;
			audioBuffer = null;
		});
	}

	var dialogConfig = dropTypes;

	function insertDialog(index) {
		var data = rainDrops[index];
		var str = document.getElementById('dialog_rain').innerHTML;
		var domString = template.render(str, {
			index: index,
			audio: '',
			position: data.position,
			content: data.content,
			user: data.user,
			time: data.time
		});
		$(document.body).append(domString);
	}

	showDialog = (function () {
		var haveOpening = false;

		return function (i, me) {
			if (haveOpening) {
				return;
			}
			insertDialog(i);

			var el = $('#dialog_' + i);
			var content = $('.m-dialog-content-text', el);
			var closeBtn = $('.m-close-btn', el);
			var showQR = false;
			var top = content.get(0).offsetTop;
			var maxHeight = 430 - top - 10;
			content.css('height', maxHeight + 'px').css('overflow', 'auto');
			var btn = $('.m-play-btn', el).get(0);
			var qrBtn = $('.m-share-qr-btn', el);
			$('.m-share-tip-btn', el).on('touchstart', showShare);
			qrBtn.on('touchstart', function (ev) {
				//ev.preventDefault();
				$('.m-qr-block', el).addClass('show');
				showQR = true;
			});
			closeBtn.on('touchstart', function (ev) {
				ev && ev.preventDefault();
				if (showQR) {
					showQR = false;
					$('.m-qr-block', el).removeClass('show');
				} else {
					clearContext();
					me && (me.lockMove = false);
					haveOpening = false;
					el.removeClass('show');
					el.remove();
				}
			});
			if (haveOpening) {
				return;
			}
			//el.on('touchstart',function(ev){
			var content_el = content.get(0);
			content.on('touchstart', function (ev) {
				ev.preventDefault();
				content.lastY = ev.touches[0].pageY;
				console.log(content.lastY);
			});
			content.on('touchmove', function (ev) {
				ev.stopPropagation();
				var deltaY = ev.touches[0].pageY - content.lastY;
				content.lastY += deltaY;
				content_el.scrollTop -= deltaY;
				//console.log(deltaY,content_el.scrollTop);
			});
			content.on('touchend', function (ev) {
				ev.stopPropagation();
			});
			el.addClass('show');
			me && (me.lockMove = true);
			load(btn, '/media/3185.wav');
			haveOpening = true;
		};
	})();
})();

function showShare(ev) {
	ev && ev.preventDefault();
	var div = document.createElement('div');
	div.className = 'g-share-tip';
	document.body.appendChild(div);
	div.addEventListener('touchstart', function (ev) {
		ev.preventDefault();
	});
	div.addEventListener('touchend', function (ev) {
		hideShare();
	});
}

function hideShare() {
	var div = document.getElementsByClassName('g-share-tip')[0];
	if (div) {
		div.parentNode.removeChild(div);
	}
}
