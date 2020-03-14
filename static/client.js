
/*document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        console.log('Socket connected correctly');
        socket.emit('waitingToPlay', {'id': socket.id});
    });

    socket.on('ack', () => {
        console.log('server has acknowlodged me');
    })
});*/

class Client {
    constructor(canvasWidth, canvasHeight, mode) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.mode = mode;

        /* Calculate the position of the new arena. */
        this.arena = new Arena(0, 0, 400, 600);
    }

    display() {
        this.arena.display();
    }
}
