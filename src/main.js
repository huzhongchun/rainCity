import { init as initStage } from './stage';
import { initBall } from './ball';
import { initLoading } from './loading';
import { initRain } from './rain';
import { getState } from './state';
import { getHash } from './hash';
import './style/main.less';

(function(){
    if (process.env.NODE_ENV != 'development') {
        if (getHash().current !== 4) {
            window.location.hash = '#';
        } else {
            const hash = window.location.hash + '';
            history.replaceState(null, document.title, '#0');
            history.pushState(null, document.title, hash);
        }
    }
})();


const pathname = window.location.pathname;

$(window).on('stage_show', function () {
    getState().current = 4;
    initStage();
});
$(window).on('ball_show', function () {
    getState().current = 3;
    initBall();
});
$(window).on('loading_show', function () {
    window.location.hash = '#1';
    getState().current = 1;
    //alert('inited');
    initLoading();
});
$(window).on('index_show', function () {
    getState().current = 0;
    window.location.hash = '#0';
    initRain();
});
$(window).on('rain_show', function () {
    getState().current = 0;
    window.location.hash = '#0';
    initRain();
});

if (process.env.NODE_ENV == 'development') {
    function match(str) {
        if (window.location.href.indexOf(str + '_test') > -1) {
            $(window).trigger(`${str}_show`);
        }
    }

    //initRain();
    match('loading');
    match('ball');
    match('stage');
    match('index');
    if (window.location.pathname.indexOf('index') > -1) {
        initRain();
    }
    const { hash } = window.location;
    //if (hash == '#1') {
    //	initLoading();
    //} else {
    //	initRain();
    //}
} else {
    const current = getHash().current;
    if (current == '1') {
        initLoading();
    } else if (current == '4') {
        getState().current = 4;
        initStage();
    }
    else {
        initRain();
    }
}
var old_hash = window.location.hash + '';
setInterval(function () {
    if (window.location.hash != old_hash) {
        old_hash = window.location.hash + '';
        window.onhashchange();
    }
}, 100);

window.onhashchange = function () {
    const hash = getHash().current;
    const current = getState().current;
    if (hash == current) return;
    if (current != 4) return;
    if (hash == 0) {
        //alert('change 0');
        getState().current = 0;
        initRain();
    } else if (hash == 1) {
        getState().current = 1;
        //alert('change 1');
        initLoading();
    } else if (hash == 3) {
        getState().current = 3;
        initBall();
    } else if (hash == 4) {
        getState().current = 4;
        initStage();
    }
};
//alert(window.location.hash);
//alert(window.location.pathname);