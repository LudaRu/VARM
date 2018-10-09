const socket = io();



const example = document.getElementById('ctx');
const ctx = example.getContext('2d');
example.width  = 1000;
example.height = 1000;

let thisPlayerId = 0; // Id данного пользователя
let thisPlayer = false; // Экземпляр класса Player данного пользователя

socket.on('newPlayer', (id) => {
    thisPlayerId = id;
});


socket.on('updateGame', (pack) => {
    ctx.clearRect(0, 0, example.width, example.height);

    const players = pack.room.playerList;
    for (let i in players) {
        const player = new Player(players[i]);
        if(player.itsMe){
            thisPlayer = player;
        }
        player.draw(ctx);
        player.drawPosition(ctx);
        // ctx.fillText(self.score,self.x,self.y-60);

    }

    const boll = pack.room.bollList;
    console.log('', boll);

    if(boll){
        boll.forEach((item, i, arr) => {
            const boll = new Boll(item);
            boll.draw(ctx);
        });
    }
});

class Boll {
    constructor(data){
        console.log('', data);

        this.id = data.id;
        this.x = data.x;
        this.y = data.y;
        this.r = data.r; // радиус, круглый игрок
        this.angle = data.angle; // Угол поврота в радианах
    }

    draw(ctx) {
        // ctx.save();
        // ctx.translate(this.x, this.y); // Переместим полотно
        // ctx.rotate(this.angle);

        // Круг
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.lineWidth = 1;
        ctx.stroke();
        // ctx.restore();
    }

    // Рендер позиции игрока
    drawPosition(ctx) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'hanging';
        ctx.fillText(`x:${this.x} y:${this.y}`, this.x, this.y + this.r);
        ctx.stroke();
    }

}


class Player {
    constructor(data) {
        this.id = data.id;
        this.x = data.x;
        this.y = data.y;
        this.r = data.r; // радиус, круглый игрок
        this.angle = data.angle; // Угол поврота в радианах
        this.itsMe = (thisPlayerId === data.id); // флаг данного пользователя
    }

    // Отрисовка игрока
    draw(ctx) {
        ctx.save();

        ctx.translate(this.x, this.y); // Переместим полотно
        ctx.rotate(this.angle);

        // Круг
        ctx.beginPath();
        if (this.itsMe){
            ctx.strokeStyle = "#ff0000";
        }
        else {
            ctx.strokeStyle = "#000000";
        }
        ctx.arc(0, 0, this.r, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.lineWidth = 1;
        ctx.stroke();

        // Полоса направлдения
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(0, 0);
        ctx.lineTo(0+ this.r, 0);
        ctx.restore();
    }

    // Рендер позиции игрока
    drawPosition(ctx) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'hanging';
        ctx.fillText(`x:${this.x} y:${this.y}`, this.x, this.y + this.r);
        ctx.stroke();
    }
}

movement = {
    pUp: false,
    pLeft: false,
    pDown: false,
    pRight: false,
    mouse: {},
};

// Клики мышки - Атаки
document.onmousedown = function(event){ //console.log(' ', movement );
    movement.mouse.click = true;
};

document.onmouseup = function(event){ //console.log(' ', movement );
    movement.mouse.click = false;
};

document.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
        case 65: // A
            movement.pLeft = true;
            break;
        case 87: // W
            movement.pUp = true;
            break;
        case 68: // D
            movement.pRight = true;
            break;
        case 83: // S
            movement.pDown = true;
            break;
    }
});
document.addEventListener('keyup', function (event) {
    switch (event.keyCode) {
        case 65: // A
            movement.pLeft = false;
            break;
        case 87: // W
            movement.pUp = false;
            break;
        case 68: // D
            movement.pRight = false;
            break;
        case 83: // S
            movement.pDown = false;
            break;
    }
});

document.onmousemove = (e) => {
    if(thisPlayer){
        const angle = Math.atan2(e.clientY - thisPlayer.y, e.clientX - thisPlayer.x);
        movement.mouse.angle = angle;
    }
};


setInterval(() => { //console.log(' ', movement );
    socket.emit('keyPress', movement);
}, 1000 / 60);



// f();
// function f() {
//     const cnv = document.getElementById("cnv");
//     const ctx = cnv.getContext("2d");
//
//     let mouse = new Vec2();
//     let distanceVec = new Vec2();
//     let myImg = new ImgSceneObject(new Image(), 'img/tank.png', 50, 50, new Vec2(200, 200));
//     let angle = 0;
//     let translationVec = new Vec2(myImg.pos.x, myImg.pos.y);
//     let direction = new Vec2();
//     let translationSpeed = 2;
//
//     function initApp() {
//         cnv.width = window.innerWidth;
//         cnv.height = window.innerHeight;
//         document.onmousemove = mousemove;
//     }
//
//     function Vec2(x = 0, y = 0) {
//         this.x = x;
//         this.y = y;
//
//         this.add = function (v) {
//             this.x += v.x;
//             this.y += v.y;
//             return this;
//         };
//
//         this.sub = function (v) {
//             this.x -= v.x;
//             this.y -= v.y;
//             return this;
//         };
//
//         this.multScalar = function (s) {
//             this.x *= s;
//             this.y *= s;
//             return this;
//         };
//
//         this.dot = function (v) {
//             return this.x * v.x + this.y * v.y;
//         };
//
//         this.rotate = function (angle) {
//             this.x = this.x * Math.cos(angle) - y * Math.sin(angle);
//             this.y = this.x * Math.sin(angle) + y * Math.cos(angle);
//             return this;
//         };
//
//         this.translate = function (v) {
//             this.add(v);
//             return this;
//         };
//
//         this.length = function () {
//             return Math.sqrt(this.x * this.x + this.y * this.y);
//         };
//
//         this.normalize = function () {
//             const invLength = 1.0 / this.length();
//             this.x *= invLength;
//             this.y *= invLength;
//             return this;
//         };
//     }
//
//     function ImgSceneObject(img, src, w, h, imageCenter) {
//         loaded = false;
//         img.onload = function () {
//             loaded = true;
//         }
//         img.src = src;
//         this.pos = imageCenter;
//         this.w = w;
//         this.h = h;
//         this.update = function (angle, v) {
//             ctx.save();
//             ctx.translate(this.pos.x, this.pos.y);
//             ctx.rotate(angle);
//             this.pos.x = v.x;
//             this.pos.y = v.y;
//             if (loaded) {
//                 ctx.drawImage(img, -this.w / 2, -this.h / 2, this.w, this.h);
//             }
//             ctx.restore();
//         };
//     }
//
//     function updateScene() {
//         renderTarget();
//         myImg.update(angle, translationVec);
//         distanceVec.x = mouse.x - myImg.pos.x;
//         distanceVec.y = mouse.y - myImg.pos.y;
//         if (distanceVec.length() > 10) {
//             translationVec.add(direction);
//         }
//     }
//
//     function renderTarget() {
//         ctx.beginPath();
//         ctx.arc(mouse.x - 7, mouse.y - 7, 7, 0, Math.PI * 2);
//         ctx.fill();
//         ctx.closePath();
//     }
//
//     function gameloop() {
//         ctx.clearRect(0, 0, cnv.width, cnv.height);
//         updateScene();
//         id = requestAnimationFrame(gameloop);
//     }
//
//     function mousemove(e) {
//         mouse.x = e.clientX;
//         mouse.y = e.clientY;
//         direction.x = mouse.x;
//         direction.y = mouse.y;
//         angle = Math.atan2(mouse.y - myImg.pos.y, mouse.x - myImg.pos.x);
//         direction.sub(myImg.pos).normalize().multScalar(translationSpeed);
//     };
//
//     initApp();
//     gameloop();
// }
