class Room {
    constructor(roomName) {
        this.roomName = roomName;
        this.playerList = [];
    }
    update() {
        const pack = [];
        for (const i in this.playerList) {
            const player = this.playerList[i];
            player.update();
            pack.push(player.getPackPlayer());
        }

        return {playerList: pack};
    }

    addPlayer(socket) {
        this.playerList[socket.id] = new Player(socket);
        socket.join(this.roomName);
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
    constructor(id) {
        this.id = id;
        this.x = 0;
        this.y = 0;
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

    constructor(socket) {
        super(socket.id);
        this.radius = 10;
        this.pressKey = {
            pUp: false,
            pLeft: false,
            pDown: false,
            pRight: false,
        };

        const self = this;
        socket.on('keyPress', (data) => {
            self.pressKey = data;
        });
    }

    update() {
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

    // Пакет игрока
    getPackPlayer() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            r: this.radius,
        }
    }
}
module.exports.Player = Player;