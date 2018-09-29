const socket = io();
socket.on('test', (data) => {
    console.log(data);
});