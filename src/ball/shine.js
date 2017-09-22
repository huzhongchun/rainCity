export function shine(x0,y0,cb){
    var canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    document.getElementById('root').appendChild(canvas);
    var w = window.innerWidth,h = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');
    var bgColor = 'rgba(255,0,0,0.02)';
    var x, y,ball_r = 185, r = ball_r,opacity = 0,
        fillColor = '249, 248, 175', blackDeep = 0;


    function start(_x, _y) {
        x = _x;
        y = _y;
        animate();
    }

    function animate() {
//        ctx.fillStyle = bgColor;
//        ctx.fillRect(0,0,w,h);
        if(opacity < 1) {
            ctx.clearRect(0,0,w,h);
            opacity += 0.008;
            ctx.fillStyle = `rgba(${fillColor}, ${opacity})`;
            ctx.fillRect(0,0,w,h);
            render();
        } else {
            ctx.fillStyle = 'rgba(0,0,0,0.03)';
            ctx.fillRect(0,0,w,h);
            blackDeep+= 0.03;
            if(blackDeep > 3){
                cb&&cb();
                return;
            }
        }

        console.log('!');
        requestAnimationFrame(animate);
    }

    function render() {
        if(r<0.5 * h) {
            r+=10;
        }
        var stop = ball_r/(r*2);
        var gradient = ctx.createRadialGradient( x, y,0,x,y,r*2);
        gradient.addColorStop(0, `rgba(${fillColor}, 0)`);
        gradient.addColorStop(stop, `rgba(${fillColor}, 0.3)`);
        gradient.addColorStop(stop, `rgba(${fillColor}, 1)`);
        gradient.addColorStop(1, `rgba(${fillColor}, 0)`);
        ctx.beginPath();
        ctx.arc(x, y, r*2, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
    }

    start(x0,y0);
}