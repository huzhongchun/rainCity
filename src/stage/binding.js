document.body.addEventListener('touchstart', function (ev) {
	ev && ev.preventDefault();
});
export function bindEvents(stage){
	document.body.onscroll = function (ev) {
		ev.preventDefault();
	};
	document.body.addEventListener('textmenu', function (ev) {
		ev.preventDefault();
	});
	document.getElementById('main').appendChild(stage.el);
	const resize = function() {
		stage.size(window.innerWidth, window.innerHeight).update();
	};
	window.onresize = function () {
		resize();
	};
	resize();
}