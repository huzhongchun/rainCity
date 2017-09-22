export const R = 440;
export const DROP_SIZE = 1.5 * (100 / 2);
export const DROP_HEIGHT = 1.5 * (283 / 4);
//		sp.position(0, 0, 0).update();
//		s.addChild(sp);
export const DROP_NUMBER = 30;
//只是根据图量出来的，没有具体意义
export const ALL_WIDTH = 226 * 5;
export const GROUP_WIDTH = 226 * 2;
export const ANCHORS = [
	[
		32,
		-R * 0.25,
		1
	],
	[
		58,
		0,
		0.85
	],
	[
		96,
		-R * 0.14,
		1.2
	],
	[
		139,
		-R * 0.4,
		1
	],
	[
		168,
		R * 0.15,
		1
	],
	[
		193,
		-R * 0.32,
		0.7
	],
	[
		226,
		-R * 0.15,
		1
	],
	[
		32 + 226,
		-R * 0.25,
		1
	],
	[
		58 + 226,
		0,
		0.85
	],
	[
		96 + 226,
		-R * 0.14,
		1.2
	],
	[
		139 + 226,
		-R * 0.4,
		1
	],
	[
		168 + 226,
		R * 0.15,
		1
	],
	[
		193 + 226,
		-R * 0.32,
		0.7
	],

];
export {dropTypes, rainDrops} from './dropTypes';