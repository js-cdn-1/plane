const canvas = document.querySelector('canvas');
canvas.width = 400;
canvas.height = 400;

const ctx = canvas.getContext('2d');

class Sprite {
    constructor(src) {
        this.x = 0;
        this.y = 0;
        this.image = new Image();
        this.image.src = src;
        this.imageLoaded = false;
        this.theta = 0;

        this.w = 16;
        this.h = 16;

        this.path = [
            // [200, 100],
            // [200, 50],
            // [250, 100],
            // [300, 200],
            [200, 50],
            // [250, 300],
            [300, 200],
            [300, 50]
        ];

        this.va = [0, -1];

        this.image.onload = () => {
            this.imageLoaded = true;
        }
    }
    render() {
        if (this.imageLoaded) {
            if (this.path.length > 0) {
                ctx.beginPath();
                ctx.strokeStyle = 'orangered';
                ctx.moveTo(this.x, this.y);
                for (var i=0; i<this.path.length; i++) {
                    ctx.lineTo(this.path[i][0], this.path[i][1]);
                }
                ctx.stroke();
                ctx.closePath();
            }
            ctx.save();
            ctx.translate(this.x, this.y)
            ctx.rotate(this.theta);
            ctx.drawImage(this.image, -this.w, -this.h);
            ctx.restore();

            if (this.path.length === 0) {
                return;
            }

            var dx = this.path[0][0] - this.x;
            var dy = this.path[0][1] - this.y;

            if (Math.sqrt(dx*dx + dy*dy) < 2) {
                this.path.shift(); // remove the first point from the path
                if (this.path.length === 0) {
                    console.log('we reached the end of the path!');
                    return;
                }

                dx = this.path[0][0] - this.x;
                dy = this.path[0][1] - this.y;
                var d = Math.sqrt(dx*dx + dy*dy);
                this.va = [dx/d, dy/d];
                this.theta = Math.atan2(dy, dx) + Math.PI/2;
            }
        }

        this.x += this.va[0];
        this.y += this.va[1];
    }
}

const plane = new Sprite('./plane.png');

plane.x = plane.y = 200;
// plane.theta = -Math.PI/4;

canvas.addEventListener('mousedown', evt => {
    if (evt.button !== 0) return;
    var rect = canvas.getBoundingClientRect();
    var m = {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    }
    plane.path.push([m.x, m.y]);
})

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    plane.render();
}


animate();