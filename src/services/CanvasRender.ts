export class CanvasRender {
    Element;
    public Graphic;
    Width;
    Height;
    
    onPointerDown: (e?: CanvasPoint) => void;
    onPointerUp: (e?: CanvasPoint) => void;
    onPointerUpAnywhere: (e?: CanvasPoint) => void;
    onPointerMove: (e?: CanvasPoint) => void;
    onSwipe: (angle: number) => void;

    constructor(width: number, height: number, element: HTMLCanvasElement) {
        this.Element = element;
        this.Graphic = element.getContext('2d');
        this.Width = width;
        this.Height = height;

        element.width = this.Width;
        element.height = this.Height;

        var swiping: CanvasPoint;
        var swipeMinDistance = 100;
        var swipeMaxTime = 200;

        element.addEventListener('touchend', e => console.log("TOUCH END"))

        element.addEventListener('pointerdown', e => {
            let r = element.getBoundingClientRect();
            
            var location = {x: e.offsetX * element.width / r.width, y: e.offsetY * element.height / r.height};
            this.onPointerDown && this.onPointerDown(location);

            swiping = {x: location.x, y: location.y};
            window.setTimeout(() => {swiping = null}, swipeMaxTime);

            console.log("DOWN", e);
        });

        element.addEventListener('mouseup', e => {
            let r = element.getBoundingClientRect();
            
            var location = {x: e.offsetX * element.width / r.width, y: e.offsetY * element.height / r.height};
            this.onPointerUp && this.onPointerUp(location);
            
            swiping = null;

            console.log("UP", location)
        });

        element.addEventListener('touchend', e => {
            let r = element.getBoundingClientRect();

            var offsetX = e.changedTouches[0].clientX - this.Element.offsetLeft;
            var offsetY = e.changedTouches[0].clientY - this.Element.offsetTop;
            
            var location = {x: offsetX * element.width / r.width, y: offsetY * element.height / r.height};
            this.onPointerUp && this.onPointerUp(location);
            
            swiping = null;

            console.log("UP", location)
        });

        element.addEventListener('pointerleave', e => {
            this.onPointerUpAnywhere && this.onPointerUpAnywhere();

            console.log("LEAVE", e);
        });

        element.addEventListener('touchmove', e => {
            let r = element.getBoundingClientRect();
            var x = e.targetTouches[0].pageX * element.width / r.width;
            var y = e.targetTouches[0].pageY * element.height / r.height;
            var location = {x, y};
            this.onPointerMove && this.onPointerMove(location);

            if (swiping) {
                var distance = Math.sqrt(Math.pow(x - swiping.x, 2) + Math.pow(y - swiping.y, 2));

                if (distance > swipeMinDistance) {
                    var angle = Math.atan2(y - swiping.y, x - swiping.x);
                    swiping = null;

                    this.onSwipe && this.onSwipe(angle);
                }
            }
        });

        element.addEventListener('mousemove', e => {
            let r = element.getBoundingClientRect();
            
            var location = {x: e.offsetX * element.width / r.width, y: e.offsetY * element.height / r.height};
            this.onPointerMove && this.onPointerMove(location);

            if (swiping) {
                var distance = Math.sqrt(Math.pow(location.x - swiping.x, 2) + Math.pow(location.y - swiping.y, 2));

                if (distance > swipeMinDistance) {
                    var angle = Math.atan2(location.y - swiping.y, location.x - swiping.x);
                    swiping = null;

                    this.onSwipe && this.onSwipe(angle);
                }
            }
        });
    }

    clear() {
        this.Graphic.clearRect(0, 0, this.Width, this.Height);
    }

    drawBackgroundImage(element: HTMLImageElement, width: number, height: number) {
        this.Graphic.drawImage(element, 0, 0, 1200, 1200);
    }
    
    drawBackground(bgColor: string) {
        this.Graphic.beginPath();
        this.Graphic.rect(0, 0, this.Width, this.Height);
        this.Graphic.fillStyle = bgColor;
        this.Graphic.fill();
    }

    drawRect(x: number, y: number, width: number, height: number, color: string, alpha = 1) {
        this.Graphic.beginPath();
        this.Graphic.rect(x, y, width, height);
        this.Graphic.fillStyle = color;
        this.Graphic.strokeStyle = "#000000";
        this.Graphic.lineWidth = 2;
        this.Graphic.globalAlpha = Math.max(alpha, 0);
        this.Graphic.fill();
        this.Graphic.stroke();
        this.Graphic.globalAlpha = 1;
    }

    drawHexagon(x: number, y: number, radius: number, strokeColor: string, fillColor: string, alpha = 1){
        this.Graphic.beginPath();
        this.Graphic.beginPath();
        var a = 2 * Math.PI / 6;
        for (var i = 0.5; i < 6.5; i++) {
            this.Graphic.lineTo(x + radius * Math.cos(a * i), y + radius * Math.sin(a * i));
        }
        this.Graphic.closePath();
        this.Graphic.stroke();
        this.Graphic.lineWidth = 3;
        this.Graphic.strokeStyle = strokeColor;
        this.Graphic.fillStyle = fillColor;
        this.Graphic.globalAlpha = Math.max(alpha, 0);
        this.Graphic.fill();
        this.Graphic.stroke();
        this.Graphic.globalAlpha = 1;
    }

    drawHexagon2(x: number, y: number, radius: number, strokeWeight: number, fillColor: string, alpha = 1, tilt = 0.5){
        this.Graphic.beginPath();
        this.Graphic.beginPath();
        var a = 2 * Math.PI / 6;
        for (var i = 0; i < 6; i++) {
            this.Graphic.lineTo(x + radius * Math.cos(a * i), y + tilt * (radius * Math.sin(a * i)));
        }
        this.Graphic.closePath();
        this.Graphic.stroke();
        this.Graphic.lineWidth = 3;
        this.Graphic.strokeStyle = '#000';
        this.Graphic.fillStyle = fillColor;
        this.Graphic.globalAlpha = Math.max(alpha, 0);
        this.Graphic.fill();
        this.Graphic.stroke();
        this.Graphic.globalAlpha = 1;
    }
    
    drawCircle(x: number, y: number, radius: number, strokeColor: string, fillColor: string, alpha = 1) {
        this.Graphic.beginPath();
        this.Graphic.arc(x, y, radius, 0, 2 * Math.PI);
        this.Graphic.lineWidth = 3;
        this.Graphic.strokeStyle = strokeColor;
        this.Graphic.fillStyle = fillColor;
        this.Graphic.globalAlpha = Math.max(alpha, 0);
        this.Graphic.fill();
        this.Graphic.stroke();
        this.Graphic.globalAlpha = 1;
    }

    drawElipse(x: number, y: number, radiusX: number, radiusY: number, strokeColor: string, fillColor: string, alpha = 1) {
        this.Graphic.beginPath();
        // this.Graphic.elipse(x, y, radius, 0, 2 * Math.PI);
        this.Graphic.ellipse(x, y, radiusX, radiusY, 0, 0, 2 * Math.PI);
        this.Graphic.lineWidth = 3;
        this.Graphic.strokeStyle = strokeColor;
        this.Graphic.fillStyle = fillColor;
        this.Graphic.globalAlpha = Math.max(alpha, 0);
        this.Graphic.fill();
        this.Graphic.stroke();
        this.Graphic.globalAlpha = 1;
    }

    drawRing(x: number, y: number, radius: number, strokeColor: string, fillColor: string, alpha = 1) {
        this.Graphic.beginPath();
        this.Graphic.arc(x, y, radius, 0, 2 * Math.PI);
        this.Graphic.lineWidth = 10;
        this.Graphic.strokeStyle = fillColor;
        // this.Graphic.fillStyle = fillColor;
        this.Graphic.globalAlpha = Math.max(alpha, 0);
        // this.Graphic.fill();
        this.Graphic.stroke();
        this.Graphic.globalAlpha = 1;
    }

    drawPartialCirclePercent(x: number, y: number, radius: number, color: string, percent: number) {
        this.Graphic.beginPath();
        this.Graphic.arc(x, y, radius, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * percent);
        this.Graphic.lineWidth = 10;
        this.Graphic.strokeStyle = color;
        this.Graphic.globalAlpha = 1;
        this.Graphic.stroke();
        this.Graphic.globalAlpha = 1;
    }

    drawPartialCircle(x: number, y: number, radius: number, color: string, startAngle: number, endAngle: number) {
        this.Graphic.beginPath();
        this.Graphic.arc(x, y, radius, startAngle, endAngle);
        this.Graphic.lineWidth = 10;
        this.Graphic.strokeStyle = color;
        this.Graphic.globalAlpha = 1;
        this.Graphic.stroke();
        this.Graphic.globalAlpha = 1;
    }

    drawParticle(x: number, y: number, radius: number, fillColor: string, alpha = 1) {
        this.Graphic.beginPath();
        this.Graphic.arc(x, y, radius, 0, 2 * Math.PI);
        this.Graphic.lineWidth = 1;
        this.Graphic.strokeStyle = '#000000';
        this.Graphic.globalAlpha = Math.max(alpha, 0);
        this.Graphic.fillStyle = fillColor;
        this.Graphic.fill();
        this.Graphic.stroke();
        this.Graphic.globalAlpha = 1;
    }
    
    addText(x: number, y: number, text: string, size = 50, color = '#000000', alpha = 1) {
        this.Graphic.font = `${size}px Arial`;
        this.Graphic.fillStyle = color;
        this.Graphic.globalAlpha = Math.max(alpha, 0);
        this.Graphic.fillText(text, x, y);
        this.Graphic.globalAlpha = 1;
    }
}

export interface CanvasPoint {
    x: number;
    y: number;
}