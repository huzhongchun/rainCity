window.addEventListener('touchstart', function (ev) {
	ev.preventDefault();
});

function goLoading() {
	window.location.href = '/loading_entry.html';
}
document.getElementById('nav_left').addEventListener('touchend',  getMap);
document.getElementById('nav_right').addEventListener('touchend', goLoading);

var clearColor = 'rgba(0, 0, 0, 0)';

var c = document.getElementById('canvas-club');
//c.style.backgroundColor = 'rgba(0, 0, 0, 0.55)';
c.style.opacity = 1;
var DROP_SIZE = 1, DROP_LENGTH = 80, DROP_COLOR = 'rgba(255,255,255,0.5)';
var ctx = c.getContext('2d');
var w = window.innerWidth;
var h = window.innerHeight;
c.width = w * window.devicePixelRatio;
c.height = h * window.devicePixelRatio;
c.style.width = w + 'px';
c.style.height = h + 'px';
var max = 200;
var drops = [];
var deg = 0;
var dropImage;
var dropSize = { w: 0, h: 0 };
var timeout = 10;
var start = 0;
function random(min, max) {
	return Math.random() * (max - min) + min;
}

function O() {
}

ctx.strokeStyle = '#fff';
ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
O.prototype = {
	init: function () {
		var scale = random(0.3, 0.8);
		//var scale  =0.8;

		this.color = DROP_COLOR;
		this.w = 2;
		this.h = random(1, 2);
		this.vy = 40;//下落速度
		this.vw = random(3, 5);//圈圈大小
		this.vh = 1;
		this.size = Math.ceil(Math.random()*1.2);//
		this.len = random(DROP_LENGTH * 0.4, DROP_LENGTH);
		if(!this.x) {
			this.x = random(0, w);
		}

		//this.y = random(0, h / 3);
		this.y = -this.len;
		this.hitX = this.x;
		this.hitY = random(h * .85, h * .95);
		//this.hitY = h;
		this.a = 0.3;
		this.va = 0.9;
		this.sw = scale * dropSize.w;
		this.sh = scale * dropSize.h;
		this.gradient = null;
	},
	draw: function () {
		if (this.y > this.hitY) {
			ctx.beginPath();
			ctx.moveTo(this.x, this.y - this.h / 2);

			ctx.bezierCurveTo(
				this.x + this.w / 2, this.y - this.h / 2,
				this.x + this.w / 2, this.y + this.h / 2,
				this.x, this.y + this.h / 2);

			ctx.bezierCurveTo(
				this.x - this.w / 2, this.y + this.h / 2,
				this.x - this.w / 2, this.y - this.h / 2,
				this.x, this.y - this.h / 2);

			//ctx.strokeStyle = this.color;
			//debugger;
			var gradient = ctx.createRadialGradient(this.x, this.y, this.w / 2, this.x, this.y, 0);
			var opacity = 0.4 * (1 - (this.w / 50));
			gradient.addColorStop(0, 'rgba(255,255,255,' + 0.4 * opacity + ')');
			gradient.addColorStop(1, 'rgba(255,255,255,' + opacity + ')');
			ctx.fillStyle = gradient;
			ctx.fill();
			//ctx.stroke();
			ctx.closePath();

		} else {
			//v1
			//ctx.clearRect(this.x, 0, this.size, this.y - this.len);
			//ctx.fillStyle = clearColor;
			//ctx.fillRect(this.x, 0, this.size, this.y - this.len);
			//ctx.fillStyle = DROP_COLOR;
			//ctx.fillRect(this.x, this.y, this.size, this.len);

			//v2
			var x1 = this.x + this.len * Math.sin(deg * Math.PI / 180);
			var y1 = this.y + this.len * Math.cos(deg * Math.PI / 180);
			//var rainGradient = ctx.createLinearGradient(this.x, this.y, x1, y1);
			//rainGradient.addColorStop(0, 'rgba(0,0,0,0)');
			//rainGradient.addColorStop(1, this.color);
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.lineWidth = this.size;
			ctx.lineTo(x1, y1);
			ctx.stroke();
			//ctx.closePath();

			//v3
			//ctx.drawImage(dropImage, this.x, this.y, this.sw, this.sh);
		}
		this.update();
	},
	update: function () {
		if (this.y < this.hitY) {
			this.y += this.vy;
			//this.x += this.vy * Math.sin(deg * Math.PI / 180);
		} else {
			if (this.a > .03) {
				this.w += this.vw;
				this.h += this.vh;
				if (this.w > 50) {
					this.a *= this.va;
					this.vw *= .98;
					this.vh *= .98;
				}
			} else {
				this.init();
			}
		}
	}
};

function resize() {
	w = c.width = window.innerWidth;
	h = c.height = window.innerHeight;
}

function setup() {
	// gradient = ctx.createLinearGradient(0, 0, 0, 2);
	// gradient.addColorStop(0, clearColor);
	// gradient.addColorStop(1, DROP_COLOR);

	for (var i = 0; i < max; i++) {
		(function (j) {
			setTimeout(function () {
				var o = new O();
				o.init();
				drops.push(o);
			}, j * 50);
		}(i));
	}

}

var x = 0;
var zip = new JSZip();
var imgFolder = zip.folder('gif');
function anim() {
	//ctx.fillStyle = clearColor;
	ctx.clearRect(0, 0, w, h);
	//ctx.fillRect(0, 0, w, h);

	for (var i in drops) {
		drops[i].draw();
	}
	//ctx.rotate(deg*Math.PI/180);
	if(Date.now() - start > timeout * 1000 && x < 60) {
		console.log(++x);
		var content = c.toDataURL();
		var startIndex = content.indexOf('base64,');
		imgFolder.file(x + '.png', content.slice(startIndex + 7), { base64: true });
	}
	if(x >= 60) {
		zip.generateAsync({ type: 'blob' })
		.then(function (content) {
			// see FileSaver.js
			saveAs(content, 'gif.zip');
		});
		return;
	}
	requestAnimationFrame(anim);
}

window.addEventListener('resize', resize);

function requestImage(url, cb) {
	var img = new Image();
	img.onload = function () {
		cb(img);
	};
	img.src = url;
}

(function () {
	var imgArr = [
		'/images/rain/rain_city.jpg',
		'/images/rain/circle-inner.png',
		'/images/rain/circle-out.png',
		'/images/rain/text_left.png',
		'/images/rain/text_right.png',
		'/images/rain/rain.png'
	];
	var loaded = 0, len = imgArr.length;
	var img = new Image();
	imgArr.forEach(function (url, i) {
		requestImage(url, cb(i));
	});

	function cb(i) {
		return function (img) {
			loaded++;
			if (i === 0) {
				img.className = 'g-bg-image';
				document.getElementById('bg_wrap').appendChild(img);
			} else if (i === 5) {
				dropImage = img;
				dropSize.w = img.width;
				dropSize.h = img.height;
			}
			if (loaded >= len) {

				setTimeout(function () {
					document.getElementById('nav_left').className += ' show';
				}, 500);
				setTimeout(function () {
					document.getElementById('nav_right').className += ' show';
				}, 1000);
				setTimeout(function () {
					setup();
					anim();
					start = Date.now();
				}, 2000);
			}
		};
	}

})();
