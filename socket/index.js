module.exports = (server) => {
    const io = require('socket.io').listen(server);
    io.on('connection', (socket) => {
        socket.emit('test', 'test' + socket.id)
    });
};