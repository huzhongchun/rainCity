export function loadingFunc(){
	const wrap = document.getElementById('wrap');

	const text = document.getElementById('text');
	let hasLoading = false;
	return function (percent) {
		console.log(percent);
		if (!hasLoading) {
			wrap.classList.add('loading');
			hasLoading = true;
		}
		wrap.style.transform = 'translateY(' + (-70 + (420 * (100 - percent) / 100)) + 'px)';
		if (percent >= 100) {
			wrap.className += ' stop';
		} else {
			text.innerHTML = percent < 10 ? 0 + '' + Math.ceil(percent) + '%' : Math.ceil(percent) + '%';
		}
	}
}
