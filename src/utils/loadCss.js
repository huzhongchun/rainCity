export function loadCss(href, cb) {
	if ($(`head link[href="${href}"]`).length === 0) {
		const link = document.createElement('link');
		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.href = href;
		document.getElementsByTagName('head')[0].appendChild(link);
		CSSloaded(link, cb)();
	} else{
		cb && cb();
	}
}

function CSSloaded(link, cb) {
	let cssLoaded = false;
	const ret = function () {
		try {
			if (link.sheet && link.sheet.cssRules.length > 0) {
				cssLoaded = true;
			} else if (link.styleSheet && link.styleSheet.cssText.length > 0) {
				cssLoaded = true;
			} else if (link.innerHTML && link.innerHTML.length > 0) {
				cssLoaded = true;
			}
		}
		catch (ex) { }
		if (cssLoaded) {
			cb && cb();
		} else {
			setTimeout(function () {
				ret();
			}, 32);
		}
	};
	return ret;

}