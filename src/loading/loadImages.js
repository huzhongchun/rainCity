import {imageBlob} from '../utils/loadImageBlob';
import {rainDrops} from '../stage/scene/drops/config';
import {images} from './file_list';
export const loadImagesFunc = (loading, loadVideo) => () => {

	const len = images.length;
	let loaded = 0;
	const cb = function () {
		loaded++;
		loading(50 * loaded / len);
		if (loaded >= len) {
			loadVideo('/media/v.mp4');
		}
	};
	images.forEach(function (url, i) {
		const s = setTimeout(function () {
			imageBlob(url, cb);
			clearTimeout(s);
		}, i * 100);
	});
};