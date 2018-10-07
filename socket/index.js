module.exports = (server) => {
    const io = require('socket.io').listen(server);
    const ROOM_NAME = 'room';
    const entity = require('./entity');

    const room = new entity.Room(ROOM_NAME);

    io.on('connection', (socket) => {
        const id = socket.id;
        socket.emit('newPlayer', id);

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
    }, 1000 / 60)


};