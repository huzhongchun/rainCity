const syncKeys = ['rotationY', 'rotationY', 'rotationY', 'x', 'y',];

function syncStage0(rate, from, to) {
	if (rate > 1) {
		syncKeys.forEach(function (k) {
			to[k] = from[k] * rate;
		});
	} else if (rate < 1) {
		syncKeys.forEach(function (k) {
			to[k] += (from[k] - to[k]) * rate;
		});
	}
	to.updateT();
}

export function syncStage( from, to) {
	to.rotationX = from.rotationX ;
	to.rotationY = from.rotationY;
	to.rotationZ = from.rotationZ;
	to.x = from.x;
	to.y = from.y;
	to.z = from.z;
	to.updateT();
}