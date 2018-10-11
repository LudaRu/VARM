class Room {
    constructor(roomName) {
        this.roomName = roomName;
        this.playerList = []; // Тут кранятся объекты класса Player, короче список игроков
        this.bolList = []; // Тут кранятся объекты класса Player, короче список игроков
    }

    update() {

        const packPlayer = [];
        for (const i in this.playerList) { // i - это просто ключ массива
            const player = this.playerList[i]; // чо за цикл ? МАГИя, я понял, непривычный цикл
            player.update();
            packPlayer.push(player.getPack());
        }

        const packBoll = [];
        for (const i in this.bolList) { // i - это просто ключ массива
            const boll = this.bolList[i]; // чо за цикл ? МАГИя, я понял, непривычный цикл
            boll.update();
            // if((boll.x < 1200) && (boll.x > -200) && (boll.y > -200)&& (boll.y < 1200)){
            //     packBoll.push(boll.getPack());
            // }

            if(boll.radius < 1){
                this.deleteBoll(boll.id);
            }
            else {packBoll.push(boll.getPack());}
            // }
        }

        // кализ
        for (const i in this.playerList) {
            const player = this.playerList[i];
            for (const j in this.bolList) {
                const boll = this.bolList[j];

                if (((boll.x - player.x)*(boll.x - player.x) + (boll.y - player.y)*(boll.y - player.y) <= (player.radius+boll.radius)*(player.radius+boll.radius))){
                    player.updateMass(boll.radius*boll.radius);
                    this.deleteBoll(boll.id);
                }

            }
        }

        return {
            playerList: packPlayer,
            bollList: packBoll
        };
    }

    addPlayer(socket) {
        this.playerList[socket.id] = new Player(socket, this);
        socket.join(this.roomName);
    }

    addBol(id, player) {
        this.bolList[id] = new Bol(id, player);
    }

    deleteBoll(id) {
        delete this.bolList[id];
    }

    deletePlayer(socket) {
        delete this.playerList[socket.id];
    }
}
module.exports.Room = Room;



// todo в разработке
class Map {
    constructor() {
        this.width = 1000;
        this.height = 1000;
    }
}
module.exports.Map = Map;



// Базовая сущность
class Entity {
    constructor(id = null) {
        this.id = id;
        this.x = 0;
        this.y = 0;
        this.radius = 1;
        this.angle = 0;
        this.spd = 5;
    }

    update() {
        this._updatePosition();
    }

    _updatePosition() {
        this.x += this.spd;
        this.y += this.spd;
    }

}
module.exports.Entity = Entity;

class Player extends Entity {

    constructor(socket, Room) {
        super(socket.id);
        this.Room = Room;
        this.radius = 10;
        this.pressKey = {
            pUp: false,
            pLeft: false,
            pDown: false,
            pRight: false,
            mouse:{
                angle: 0,
            }
        };

        const self = this;
        socket.on('keyPress', (data) => {
            self.pressKey = data;
            if(data.mouse.click){
                const id = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
                this.Room.addBol(id, this);
            }
        });
    }

    update()
    {
        if (this.pressKey.pUp) {
            this.y = this.y - this.spd;
        }
        if (this.pressKey.pDown) {
            this.y = this.y + this.spd;
        }
        if (this.pressKey.pLeft) {
            this.x = this.x - this.spd;
        }
        if (this.pressKey.pRight) {
            this.x = this.x + this.spd;
        }

    }

    updateMass(mass){
        this.radius = this.radius + mass/(this.radius*this.radius);
    }

    // Пакет игрока
    getPack() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            r: this.radius,
            angle: this.pressKey.mouse.angle,
        }
    }
}
module.exports.Player = Player;


// Снаяряд
class Bol extends Entity {
    constructor(id, player) {
        super(id);
        this.Player = player;
        this.angle = player.pressKey.mouse.angle;
        this.x = player.x + Math.cos(this.angle)* (player.radius+  player.radius/4);
        this.y = player.y + Math.sin(this.angle)* (player.radius+  player.radius/4);
        this.T =0;
        this.radius = player.radius/4;
    }

    getPack() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            r: this.radius,
            angle: this.angle,
        }
    }
    update() {
        this.T++;
        const lodX = this.x;
        const lodY = this.y;
        this.x += Math.cos(this.angle)*this.spd*2;
        this.y += Math.sin(this.angle)*this.spd*2;


        if (this.x >= 1000){
            this.x = 1000;
            this.angle += 2 * Math.acos(Math.sin(this.angle));
            this.tuck();
        }
        if (this.y >= 1000){
            this.y = 1000;
            this.angle -= 2 * Math.acos(Math.cos(this.angle));
            this.tuck();
        }
        if (this.y <= 0){
            this.y = 0;
            this.angle += 2 * Math.acos(Math.cos(this.angle));
            this.tuck();
        }
        if (this.x <= 0){
            this.x = 0;
            this.angle -= 2 * Math.acos(Math.sin(this.angle));
            this.tuck();
        }
    }

    tuck(){
        if(Math.random() >= 0.5){
            this.radius -= this.radius/4
        }
    }
}
module.exports.Bol = Bol;