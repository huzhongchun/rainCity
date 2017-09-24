import { RAF } from '../../utils/RAF';
import { BASE_Z, syncStage } from './common';
import {getState} from '../../state';
export class Controller {
	originTouchPos = {
		x: 0,
		y: 0
	};
	oldTouchPos = {
		x: 0,
		y: 0
	};
	newTouchPos = {
		x: 0,
		y: 0
	};
	d = {
		lat: 0,
		lon: 0
	};
	c = {
		lat: 0,
		lon: 0
	};
	f = {
		lat: 0,
		lon: 0
	};
	firstDir = '';
	req = null;
	originTime = 0;
	oldTime = 0;
	newTime = 0;
	dx = 0;
	dy = 0;
	ax = 0;
	ay = 0;
	time = 0;
	stage = null;
	constructor(){
		return this;
	}
	init(stage,drops) {
		this.stage = stage;
		this.drops = drops;
		this.onTouchStart = this.onTouchStart.bind(this);
		this.onTouchMove = this.onTouchMove.bind(this);
		this.onTouchEnd = this.onTouchEnd.bind(this);
		this.stage.on('touchstart', this.onTouchStart, true);
		this.reqRotate();

		const g = new Orienter({
			onOrient: (t)=>{
				if (this.stage.lockMove) return 1;
				this.d.lat = t.lat;
				this.d.lon = -t.lon;
			}
		});
		g.init();
		return this;
	}

	clear() {
		this.stage.off('touchstart', this.onTouchStart);
		this.stage.off('touchmove', this.onTouchMove);
		this.stage.off('touchend', this.onTouchEnd);
	}

	onTouchStart(_e) {
		_e.preventDefault();
		this.firstDir = '';
		const e = _e.changedTouches[0];
		if (this.stage.lockMove) return 1;
		this.originTouchPos.x = this.oldTouchPos.x = this.newTouchPos.x = e.clientX;
		this.originTouchPos.y = this.oldTouchPos.y = this.newTouchPos.y = e.clientY;
		this.originTime = this.oldTime = this.newTime = Date.now();
		this.dx = this.dy = this.ax = this.ay = 0;

		this.stage.on('touchmove', this.onTouchMove);
		this.stage.on('touchend', this.onTouchEnd, true);

		getState().touching = true;
		//			console.log('start');
	}

	onTouchMove(e) {
		e.preventDefault();
		if (this.stage.lockMove) return 1;

		e = e.changedTouches[0];

		this.newTouchPos.x = e.clientX;
		this.newTouchPos.y = e.clientY;
		this.newTime = Date.now();
		this.checkGesture();
		this.oldTouchPos.x = this.newTouchPos.x;
		this.oldTouchPos.y = this.newTouchPos.y;
		this.oldTime = this.newTime;
	}

	onTouchEnd() {
		this.newTime = Date.now();
		const t = (this.newTime - this.oldTime) / 1000;
		getState().touching = false;
		this.stage.off('touchmove', this.onTouchMove);
		this.stage.off('touchend', this.onTouchEnd);
	}

	checkGesture() {
		if (this.stage.lockMove) return 1;
		this.dx = this.fixed2(this.newTouchPos.x - this.originTouchPos.x);
		this.dy = this.fixed2(this.newTouchPos.y - this.originTouchPos.y);
		this.ax = this.fixed2(this.newTouchPos.x - this.oldTouchPos.x);
		this.ay = this.fixed2(this.newTouchPos.y - this.oldTouchPos.y);
		this.time = (this.newTime - this.oldTime) / 1000;
		if (this.firstDir === '') {
			this.firstDir = (Math.abs(this.ax) > Math.abs(this.ay)) ? 'x' : 'y';
		}
		const data = {
			dx: this.dx,
			dy: this.dy,
			ax: this.ax,
			ay: this.ay,
			dir: this.firstDir
		};
		this.computedMove(data);

	}

	fixed2(t) {
		return Math.floor(100 * t) / 100;
	}

	computedMove(t) {
		this.c.lon = (this.c.lon - .2 * t.ax) % 360;
		this.c.lat = Math.max(-90, Math.min(90, this.c.lat + .2 * t.ay));
	}

	reqRotate() {
		this.req = RAF(this.reqRotate.bind(this));
		if (!this.stage.lockMove) {

			const t = (this.d.lon + this.f.lon + this.c.lon) % 360;
			const i = 0.35 * (this.d.lat + this.f.lat + this.c.lat);

			if ((t - this.stage.rotationY) > 180) {
				this.stage.rotationY += 360;
			}

			if ((t - this.stage.rotationY) < -180) {
				this.stage.rotationY -= 360;
			}

			const n = t - this.stage.rotationY, a = i - this.stage.rotationX;

			this.stage.rotationY = Math.abs(n) < 0.1 ? t : this.stage.rotationY + .3 * n;
			this.stage.rotationX = Math.abs(a) < 0.1 ? i : this.stage.rotationX + .15 * a;

			const s = BASE_Z - 2 * Math.abs(n);
			this.stage.z += .3 * (s - this.stage.z);

			this.stage.updateT();
			syncStage(this.stage, this.drops);
		}
	}
}