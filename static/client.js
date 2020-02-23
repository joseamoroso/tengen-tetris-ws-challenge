document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        console.log('I just connected');
        socket.emit('newconnection', {'id': socket.id});
    });

    socket.on('ack', () => {
        console.log('server has acknowlodged me');
    })
});