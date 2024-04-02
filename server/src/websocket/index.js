import Chat from '../models/chat.model.js'

function webSocket(server) {
    const io = server;

    io.on('connection', (socket) => {
       
    });

}

export default webSocket;