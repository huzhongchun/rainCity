import { templateStr } from './template';
import { Visualizer } from './Visualizer';
import { getState } from '../../state';
import {load} from './Player/load';
import {iOSLoad,clearContext} from './Player/iOSLoad';
import {rainDrops} from '../scene/drops/dropTypes';
const state = getState();
const isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
//const loadFunc = isiOS ? iOSLoad : load;
const loadFunc = iOSLoad;

function insertDialog(index) {
	const data = rainDrops[index];

	const domString = _.template(templateStr)({
		index: index,
		audio: '',
		position: data.position,
		content: data.content,
		user: data.user,
		time: data.time
	});
	$(document.body).append(domString);
}

function showShare(ev) {
	ev && ev.preventDefault();
	const div = document.createElement('div');

	div.className = 'g-share-tip';
	document.body.appendChild(div);

	div.addEventListener('touchstart', function (ev) {
		ev.preventDefault();
	});
	div.addEventListener('touchend', hideShare);
}

function hideShare() {
	const div = document.getElementsByClassName('g-share-tip')[0];
	if (div) {
		div.parentNode.removeChild(div);
	}
}

export const showDialog = (function () {
	let haveOpening = false;

	function setWxShareOpt(opt) {
        wx.onMenuShareAppMessage({
            title: opt.title,
            desc:  opt.desc,
            link:  opt.link,
            imgUrl:opt.imgUrl,
        });
        wx.onMenuShareTimeline({
            title: opt.timeLineTitle,
            link:  opt.link,
            imgUrl:opt.imgUrl,
        });
    }
	return function (i, me) {
		if (haveOpening) {
			return;
		}
		insertDialog(i);
        const data = rainDrops[i];
		const el       = $('#dialog_' + i),
		      content  = $('.m-dialog-content-text', el),
		      closeBtn = $('.m-close-btn', el);
		let showQR = false;
		const top = content.get(0).offsetTop, maxHeight = 430 - top - 10;
		content.css('height', maxHeight + 'px').css('overflow', 'auto');
		const btn = $('.m-play-btn', el).get(0), qrBtn = $('.m-share-qr-btn', el);
		$('.m-share-tip-btn', el).on('touchstart', showShare);

		qrBtn.on('touchstart', function (ev) {
			$('.m-qr-block', el).addClass('show');
			showQR = true;
		});

		closeBtn.on('touchstart', function (ev) {
			ev && ev.preventDefault();
			if (showQR) {
				showQR = false;
				$('.m-qr-block', el).removeClass('show');
			} else {
				clearContext();
				me && (me.lockMove = false);
				haveOpening = false;
				el.removeClass('show');
				el.remove();
                setWxShareOpt({
                    title: '雨中城，一座永远下雨的城市',
                    desc: '一座凭空建造的雨中城市，居然被地图收录了',
                    timeLineTitle: '雨中城，一座永远下雨的城市',
                    imgUrl:process.env.CDN_PREFIX+'/images/share_img.jpg',
                    link: location.href
                });
            }
		});
		if (haveOpening) {
			return;
		}
		//el.on('touchstart',function(ev){
		const content_el = content.get(0);
		content.on('touchstart', function (ev) {
			ev.preventDefault();
			content.lastY = ev.touches[0].pageY;
			console.log(content.lastY);
		});
		content.on('touchmove', function (ev) {
			ev.stopPropagation();
			const deltaY = ev.touches[0].pageY - content.lastY;
			content.lastY += deltaY;
			content_el.scrollTop -= deltaY;
		});
		content.on('touchend', function (ev) {
			ev.stopPropagation();
		});
		el.addClass('show');
        setWxShareOpt({
            title: '我找了30个国家和省市的人，录了雨声送给你。',
            desc: '我分享了一段来自'+data.position+'的雨声给你，不来听听吗？',
            timeLineTitle:'我找了30个国家和省市的人，录了雨声送给你。',
            imgUrl:process.env.CDN_PREFIX+'/images/share_img.jpg',
            link: location.href
        });
        me && (me.lockMove = true);
		const musicURL = `${process.env.CDN_PREFIX}/media/${rainDrops[i].file}.mp3`;
		loadFunc(btn, musicURL);
		haveOpening = true;
	};
})();

