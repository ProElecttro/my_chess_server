import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const port = 5000;
const app = express();

const server = createServer(app);
app.use(cors())

const io = new Server(server, {
    cors:{
        origin: "*"
    }
});


app.get('/', (req, res) => {
    res.send("Welcome")
})

io.on('connection', socket => {
    console.log("user connected: " + socket.id)
    
    socket.on('disconnect', () => {
        console.log("user disconnected: " + socket.id)
    })

    socket.on('statechange', ({ positions, whoseTurn }) => {
        console.log(positions.toString());
        
        socket.broadcast.emit("newStateReceived", {positions, whoseTurn})
    });
})

server.listen(port,  ()=> {
    console.log('server runnning on port: ' + port)
});