import {rainDrops} from '../stage/scene/drops/config';
export 	const images = _.range(0, 20).map(x => `/images/stage/skybox/${x}.jpg`)
.concat(rainDrops.map(x => `/images/stage/drops/${x.file}.png`))
.concat([
	'/images/ball/ball.png',
	'/images/ball/ball_fg.png',
	'/images/ball/ball_bg.jpg',
	'/images/ball/ball_text.png',
	'/images/ball/airball.png',
	'/images/stage/final_bottom.jpg',
	'/images/stage/top2.jpg',
	'/images/dialog/dialog-head-bg.png',
	'/images/dialog/pause-btn.png',
	'/images/dialog/play-btn.png',
	'/images/dialog/qr.png',
	'/images/dialog/qr_img.jpg',
	'/images/dialog/share_tip.png',
]);