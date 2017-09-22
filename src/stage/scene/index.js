import { C3D } from '../../lib/css3d-engine';
import { createSkyBox } from './skybox';
import { addDrops } from './drops';
import { bindEvents } from '../binding';
import { BASE_Z } from './common';
import { RAF } from '../../utils/RAF';
import {Controller} from './Controller';


export function initScene() {
	setTimeout(function () {
		document.getElementById('loading-text').style.opacity = '0';
	}, 1000);
	setTimeout(function () {
		document.getElementById('loading-text').style.display = 'none';
		initStage();
	}, 2000);
}
function initStage(){
	const stage = new C3D.Stage();
	stage.size(window.innerWidth, window.innerHeight).update();

	const controller = new Controller();
	const skyBox = createSkyBox();
	const drops = addDrops(skyBox);

	skyBox.position(0, 0, 0).updateT();
	drops.position(0, 0, 0).updateT();
	stage.addChild(skyBox);
	stage.addChild(drops);
	bindEvents(stage);

	drops.on('touchstart', function (ev) {
		ev.preventDefault();
		controller.onTouchStart.call(controller, ev);
	}, true);
	drops.on('touchmove', function (ev) {
		ev.preventDefault();
		controller.onTouchMove.call(controller, ev);
	});
	drops.on('touchend', function (ev) {
		ev.preventDefault();
		controller.onTouchEnd.call(controller, ev);
	});
	controller.init(skyBox,drops);
}