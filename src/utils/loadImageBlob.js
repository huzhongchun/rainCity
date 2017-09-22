import { media } from './media';

const loadedUrl = {};
window.loadedUrl = loadedUrl;

function loadXHR(url) {
	return new Promise(function (resolve, reject) {
		if (url in loadedUrl) {
			resolve(loadedUrl[url]);
		} else {
			try {
				const xhr = new XMLHttpRequest();
				xhr.open('GET', media(url), true);
				xhr.responseType = 'blob';
				xhr.onerror = function () {reject({ ok: false });};
				xhr.onload = function () {
					if (xhr.status < 400 && xhr.status >= 200) {
						const newURL = (URL || webkitURL).createObjectURL(xhr.response);
						loadedUrl[url] = newURL;
						resolve({ ok: true, blob: newURL });
					}
					else {
						reject({ ok: false });
					}
				};
				xhr.send();
			}
			catch (err) {reject({ ok: false });}
		}
	});
}

export async function imageBlob(url, cb) {
	if(url.indexOf('blob') === 0) {
		cb(url);
	}
	const { ok, blob } = await loadXHR(imageURL(url));
	console.log(url, blob);
	if (ok) {
		cb(blob);
	}
}

export function imageURL(url) {
    if(url.indexOf('blob') === 0) {
       return url;
    }
	const newURL = (url.indexOf(process.env.CDN_PREFIX) === 0 ? url : process.env.CDN_PREFIX + url);

    return loadedUrl[newURL] || loadedUrl[url] || newURL;
}

export function requestImage(url, cb) {
	const img = new Image();
	img.onload = function () {
		cb && cb(img);
	};
	img.onerror = function(){
		cb && cb(img);
	};

	img.src = imageURL(url);;
}

