import {requestImage} from '../utils/loadImageBlob';
const clearColor = 'rgba(0, 0, 0, 0)';
const DROP_SIZE = 1, DROP_LENGTH = 80, DROP_COLOR = 'rgba(255,255,255,0.5)';
let w = window.innerWidth, h = window.innerHeight;
let canvas, ctx;
const max = 150, drops = [];
let deg = 0, dropSize = { w: 0, h: 0 };

function initCanvas() {
	canvas = document.getElementById('canvas-club');
	canvas.style.opacity = 0.1;
	ctx = canvas.getContext('2d');
	canvas.width = w * window.devicePixelRatio;
	canvas.height = h * window.devicePixelRatio;
	canvas.style.width = w + 'px';
	canvas.style.height = h + 'px';
	ctx.strokeStyle = '#fff';
	ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
	setup();
}

//c.style.backgroundColor = 'rgba(0, 0, 0, 0.55)';

function random(min, max) {
	return Math.random() * (max - min) + min;
}

function O() {
}

class RainAnimationController {
	init() {
		const scale = random(0.3, 0.8);
		//var scale  =0.8;

		this.color = DROP_COLOR;
		this.w = 2;
		this.h = random(1, 2);
		this.vy = 40;//下落速度
		this.vw = random(3, 5);//圈圈大小
		this.vh = 1;
		this.size = Math.ceil(Math.random() * 1.2);//
		this.len = random(DROP_LENGTH * 0.4, DROP_LENGTH);
		if (!this.x) {
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
	}

	draw() {
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
			const gradient = ctx.createRadialGradient(this.x, this.y, this.w / 2, this.x, this.y, 0);
			const opacity = 0.4 * (1 - (this.w / 50));
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
			const x1 = this.x + this.len * Math.sin(deg * Math.PI / 180);
			const y1 = this.y + this.len * Math.cos(deg * Math.PI / 180);
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
	}

	update() {
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
}

function resize() {
	w = canvas.width = window.innerWidth;
	h = canvas.height = window.innerHeight;
}

function setup() {
	for (let i = 0; i < max; i++) {
		(function (j) {
			setTimeout(function () {
				const o = new RainAnimationController();
				o.init();
				drops.push(o);
			}, j * 50);
		}(i));
	}
}

function anim() {

	ctx.clearRect(0, 0, w, h);

	for (let i in drops) {
		drops[i].draw();
	}
	requestAnimationFrame(anim);
}


export function initPage() {
	const imgArr = [
		'/images/rain/rain_city.jpg',
		'/images/rain/circle-inner.png',
		'/images/rain/circle-out.png',
		'/images/rain/text_left.png',
		'/images/rain/text_right.png',
	].concat(_.range(0,11).map(x=>`/images/rainAnim/${x}.png`));
	let loaded = 0;
	const len = imgArr.length;
	imgArr.forEach(function (url, i) {
		requestImage(url, cb(i));
	});

	function cb(i) {
		return function (img) {
			loaded++;
			if (i === 0) {
				img.className = 'g-bg-image';
				document.getElementById('bg_wrap').appendChild(img);
			}
			if (loaded >= len) {
				$('#rain_canvas').addClass('ready');
				setTimeout(function () {
					document.getElementById('nav_left').className += ' show';
				}, 500);
				setTimeout(function () {
					document.getElementById('nav_right').className += ' show';
				}, 1000);
				setTimeout(function () {
					//initCanvas();
					//anim();
				}, 2000);
			}
		};
	}
}
