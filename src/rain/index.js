import { bodyStr } from './body';
import { getMap } from './baiduMap';
import { initPage } from './rain';
import { requestImage } from '../utils/loadImageBlob';

export function initRain() {
	window.addEventListener('touchstart', function (ev) {
		ev.preventDefault();
	});
	document.body.className = 'rain-body';
	$('#root').html(bodyStr);
	$('#nav_left').on('touchend', getMap);
	$('#nav_right').on('touchend', goLoading);
	initPage();
	// playAudio();
	requestImage('/images/loading/mask.png');
	requestImage('/images/loading/bg.png');
    loadAudio(`${process.env.CDN_PREFIX}/media/bgm.mp3`);
}

function goLoading() {
	$(window).trigger('loading_show');
}

function playAudio() {
	$('body')
	.append(`<audio id="bgm" src="${process.env.CDN_PREFIX}/media/bgm.mp3" autoplay preload=""></audio>`);
	const audio = document.getElementById('bgm');
	audio.addEventListener('canplay', function () {
		doPlayAudio(audio);
	});
	audio.onended = function () {
		audio.currentTime = 0;
		doPlayAudio();
	};
	audio.load();
	doPlayAudio(audio);
}

function doPlayAudio(audio) {
	if (window.WeixinJSBridge) {
		WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
			audio.play();
		}, false);
		document.addEventListener('WeixinJSBridgeReady', function () {
			WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
				audio.play();
			});
		}, false);
	} else {
		audio.play();
	}
}

export const loadAudio =  src => {
    const req = new XMLHttpRequest();
    req.open('GET', src, true);
    req.responseType = 'blob';
    req.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            const videoBlob = this.response;
            const url = (URL || webkitURL).createObjectURL(videoBlob); // IE10+
            showVideo(url);
        }
    };
    req.send();
};

function showVideo(src) {
    let played = false;
    const audio = document.createElement('audio');
    audio.setAttribute('preload', 'true');
    audio.setAttribute('loop', 'true');
    audio.setAttribute('autoPlay', 'true');
    audio.id = 'bgm';
    document.body.appendChild(audio);

    const doPlay = function () {
        if (!played) {
            audio.play();
            played = true;
        }
    };
    const playAudioFunc = function(ev){
    	ev && ev.preventDefault();
        if (window.WeixinJSBridge) {
            WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                doPlay();
            }, false);
            document.addEventListener("WeixinJSBridgeReady", function () {
                WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                    doPlay();
                });
            }, false);
        } else {
            doPlay();
        }

    };
	const touchFunc = function(){
		playAudioFunc();
        document.body.removeEventListener('touchstart', touchFunc);
	};
    audio.addEventListener('canplay', playAudioFunc);
    document.body.addEventListener('touchstart', touchFunc);
    audio.onended = function () {
        audio.classList.add('playing');
        $(window).trigger('ball_show');
    };
    audio.src = src;
    audio.load();
    playAudioFunc();
}
