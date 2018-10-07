module.exports = (server) => {
    const io = require('socket.io').listen(server);
    const ROOM_NAME = 'room';
    const entity = require('./entity');

    const PLAYER_LIST = {};

    const room = new entity.Room(ROOM_NAME);

    io.on('connection', (socket) => {
        room.addPlayer(socket);

        socket.on('disconnect', () => {
            room.deletePlayer(socket)
        });

    });

    // gameLoop
    setInterval(() => {
        const pack = {
            room: room.update(),
        };

        io.to(ROOM_NAME).emit('updateGame', pack);


        io.sockets.emit('newPosition', PLAYER_LIST);
    }, 1000 / 60)


};