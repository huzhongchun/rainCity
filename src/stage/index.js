import { loading } from './load';
import { generateStyle } from './generateStyle';
import { initScene } from './scene';
import { bodyStr } from './body';
import { loadCss } from '../utils/loadCss';
import { getState } from '../state';
import { images } from './resources';
import { imageBlob } from '../utils/loadImageBlob';

export function init() {
    if (getState().imagesLoaded) {
        doInit();
    } else {
        const len = images.length;
        let loaded = 0;
        const imagesLoadedCb = function () {
            loaded++;
            if (loaded >= len) {
                getState().imagesLoaded = true;
                doInit();
            }
        };
        images.forEach(url => imageBlob(url, imagesLoadedCb));
    }
}

export function doInit() {
    document.body.className = 'stage-body';
    $('#root').html(bodyStr);
    generateStyle();
    getState().haveOpening = false;
    stopAudio();
    $('#stage_back_btn').on('touchend', function () {
        $(window).trigger('rain_show');
    });
    //loadCss('/css/stage.css',function(){
    //	loadCss('/css/dialog.css',function(){
    //		//loading();
    //		initScene();
    //	})
    //});
    initScene();

}

function stopAudio() {
    const audio = document.getElementById('bgm');
    $('audio').each(function (index, el) {
        $(el).get(0).pause();
        $(el).remove();
    });
    return;
    let t = 10;
    const s = setInterval(function () {
        t--;
        audio.volume -= 0.1;
        if (t <= 0) {
            audio && audio.pause();
            $(audio).remove();
            clearInterval(s);
        }
    }, 200);
}