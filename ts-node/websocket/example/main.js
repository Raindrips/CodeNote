const WebSocket = require('ws');

var __GID = 0;
function getID()
{
    return __GID++;
}

const PORT = 3001;
const server = new WebSocket.Server({
    port: PORT,
    perMessageDeflate: false  // 关闭压缩,减速延迟
})

console.log('server listen on', PORT);

server.on('connection', (socket) =>
{
    this.id = getID();
    console.log('client connected!', this.id);

    socket.on('message', (message) =>
    {
        const str = message.toString();
        console.log(this.id, 'Received:', str);
        socket.send('message byte' + message.byteLength);
    })

    socket.on('close', () =>
    {
        console.log('disconnect', this.id);
    })
})


