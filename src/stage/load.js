import { rainDrops,dropTypes } from './scene/drops/dropTypes';
import {skyBgData} from './scene/skybox/config';
import {requestImage as load} from '../utils/loadImageBlob';

export function loading(run) {
	const len = dropTypes.length + skyBgData.length + 3;
	let loaded = 0;
	const wrap = document.getElementById('loading-text');
	const loadCb = function (url) {
		loaded++;
		wrap.innerHTML = `加载资源中: ${(100 * loaded / len).toFixed(2)}%`;
		if (loaded === len) {
			wrap.innerHTML = '全部加载完成...<br/>场景渲染中，请稍候';
			run();
		}
	};
	dropTypes.forEach(type => {load('/images/stage/drops/' + type + '.png', loadCb);});
	skyBgData.forEach(x => {load(x.url, loadCb);});
	load('/images/stage/drops/bigdrop0.png', loadCb);
	load('/images/stage/drops/bigdrop1.png', loadCb);
	load('/images/stage/drops/bigdrop2.png', loadCb);
}

