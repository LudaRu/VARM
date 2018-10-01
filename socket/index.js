module.exports = (server) => {
    const io = require('socket.io').listen(server);
    const ROOM_NAME = 'room';

    class Entity {
        constructor(id) {
            this.id = id;
            this.x = 0;
            this.y = 0;
            this.spd = 10;
        }

        update() {
            this._updatePosition();
        }

        _updatePosition() {
            this.x += this.spd;
            this.y += this.spd;
        }

    }

    class Player extends Entity {

        constructor(socket) {
            super(socket.id);

            this.pressKey = {
                pUp: false,
                pLeft: false,
                pDown: false,
                pRight: false,
            };
            socket.on('keyPress', function (data) {
                this.pressKey = data; // fixme
            });
        }
    }

    class Room {
        constructor(roomName) {
            this.roomName = roomName;
            this.playerList = [];
        }


        update() {
            for(const i in this.playerList){
                const player = this.playerList[i];
                player.update();
            }
        }

        addPlayer(socket) {
            this.playerList[socket.id] = new Player(socket);
            socket.join(this.roomName);
        }

        deletePlayer(socket) {
            delete this.playerList[socket.id];
        }

    }

    const PLAYER_LIST = {};

    // const Player = (id) => {
    //     const self = {
    //         id: id,
    //         x: 10,
    //         y: 10,
    //
    //         maxSpd: 2,
    //
    //         key: {
    //             pUp: false,
    //             pLeft: false,
    //             pDown: false,
    //             pRight: false,
    //         },
    //
    //     };
    //
    //     const super_update = self.update;
    //     self.update = () => {
    //         self.updateSpd();
    //         super_update();
    //     };
    //
    //
    //     self.updateSpd = () => {
    //         if (self.key.pLeft)
    //             self.spdX -= self.maxSpd;
    //         else if (self.key.pRight)
    //             self.spdX += self.maxSpd;
    //         else
    //             self.spdX = 0;
    //
    //         if (self.key.pUp)
    //             self.spdY -= self.maxSpd;
    //         else if (self.key.pDown)
    //             self.spdY += self.maxSpd;
    //         else
    //             self.spdY = 0;
    //     };
    //
    //
    //     self.updateSpd = () => {
    //         if (self.key.pUp) self.y -= self.maxSpd;
    //         if (self.key.pLeft) self.x -= self.maxSpd;
    //         if (self.key.pDown) self.y += self.maxSpd;
    //         if (self.key.pRight) self.x += self.maxSpd;
    //     };
    //     Player.list[id] = self;
    //
    //     Player.onConnect = (socket) => {
    //         const player = Player(socket.id);
    //
    //         socket.on('pressKey', (data) => {
    //             player.key.pUp = data.pUp;
    //             player.key.pLeft = data.pLeft;
    //             player.key.pDown = data.pDown;
    //             player.key.pRight = data.pRight;
    //         })
    //     };
    //
    //     Player.onDisconnect = (socket) => {
    //         delete Player.list[socket.id];
    //     };
    //
    //
    //     return self;
    // };
    // Player.list = {};

    const room = new Room('room');

    io.on('connection', (socket) => {
        room.addPlayer(socket);

        socket.on('disconnect', () => {
            room.deletePlayer(socket)
        });

    });


    // gameLoop
    setInterval(() => {
        const pack = {
            player: room.update(),
        };

        io.to(ROOM_NAME).emit(pack);


        io.sockets.emit('newPosition', PLAYER_LIST);
    }, 1000 / 60)


};