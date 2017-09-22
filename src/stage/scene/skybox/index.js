import { C3D } from '../../../lib/css3d-engine';
import { skyBgData, skyRect as rect } from './config';
import {imageURL} from '../../../utils/loadImageBlob';
export function createSkyBox() {
	const _len = skyBgData.length;
	const step = rect.w / _len;
	const _radius = Math.floor(step / 2 / Math.tan(Math.PI / _len)) - 1;

	const sprite = new C3D.Sprite();
	for (let i = 0; i < _len; i++) {
		const r = 360 / _len * i;
		const alpha = Math.PI * 2 / _len * i;

		const plan = new C3D.Plane();

		plan.size(step, rect.h, 0).position(Math.sin(alpha) * _radius, 0, -Math.cos(alpha) * _radius)
		.rotation(0, -r, 0).material({ image: imageURL(skyBgData[i].url), repeat: 'no-repeat', bothsides: false, })
		.class('m-sky-pano').update();

		sprite.addChild(plan);
	}
	const bottomPlane = new C3D.Plane();
	const topPlane = new C3D.Plane();

	topPlane.size(_radius * 2, _radius * 2, 0).position(0, -rect.h / 2, 0).rotation(90, 0, 0)
	.class('m-top').update();

	bottomPlane.size(_radius * 2, _radius * 2, 0).position(0, rect.h / 2, 0).rotation(90, 0, 0)
	.class('m-bottom').update();

	sprite.addChild(topPlane);
	sprite.addChild(bottomPlane);

	return sprite;
}