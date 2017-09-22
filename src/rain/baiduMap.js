function getMap_old() {
	const geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function (r) {
		if (this.getStatus() == window.BMAP_STATUS_SUCCESS) {
			var panoramaService = new BMap.PanoramaService();
			panoramaService.getPanoramaByLocation(new BMap.Point(r.point.lng, r.point.lat), function (data) {
					if (data == null) {
						console.log('no data');
						return;
					}
					window.location.href = 'http://map.baidu.com/mobile/webapp/index/streetview/pid='+ data.id+'&from=indexMap';
				}
			)
		} else {
			alert('failed' + this.getStatus());
		}
	})
}

export function getMap(){
	window.location.href = process.env.BAIDU_MAP_URL;
}