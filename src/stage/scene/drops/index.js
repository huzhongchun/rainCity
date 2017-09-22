import { C3D } from '../../../lib/css3d-engine';
import { R, DROP_SIZE, DROP_HEIGHT, DROP_NUMBER, ALL_WIDTH, GROUP_WIDTH, ANCHORS } from './config';
import {dropTypes} from './config';
import {showDialog} from '../../dialog';
import {skyRect} from '../skybox/config';
		
export function addDrops(skyBox) {
	const sprite = new C3D.Sprite();
	const l = ANCHORS.length;
	//创建20个平面放入容器，并定义鼠标事件
	for (let i = 0; i < DROP_NUMBER; i++) {
		let imageURL = 'drops/' + dropTypes[i] + '.png';
		const offsetX = Math.floor(i / l) * GROUP_WIDTH + ANCHORS[i % l][0];
		const alpha = (offsetX / ALL_WIDTH);
		const theta = (offsetX / ALL_WIDTH) * 2 * Math.PI;
		const plane = new C3D.Plane();
		const dy = ANCHORS[i % l][1];
		const scale = ANCHORS[i % l][2];
		const x = Math.sin(theta) * R,y = dy - R * 0.15,z = -Math.cos(theta) * R;
		plane.size(DROP_SIZE * scale, DROP_HEIGHT * scale)
		.position(x, y, z)
		.rotation(0, -alpha * 360, 0)
		.buttonMode(true)
		.class(`m-rain-drop drop${i} anim_${i}`)
		.update();

		const rope = new C3D.Plane();
		rope.size(0,0)
		.position(x,y,z)
		.rotation(0,-alpha * 360,0)
		.class(`m-drop-rope anim_${i}`)
		.update();

		sprite.addChild(plane);
		sprite.addChild(rope);
		plane.on('touchstart', function (ev) {
			ev.preventDefault();
			const el = this.le.el;
			el.classList.add('hovering');
			setTimeout(function () {
				el.classList.remove('hovering');
			}, 1000);
		});
		plane.on('touchend', onDropTouchEnd(i,skyBox));
	}
	return sprite;
}

export function onDropTouchEnd(i,pano) {
	return function () {
		this.le.el.classList.add('visited');
		showDialog(i, pano);
	};
}