const cookieParser = require('cookie-parser');
require('dotenv').config();
const express = require('express');
const api = require('./routes/api')
const cors = require('cors')
const activeUsers = require('./socket/users.socket')
require('./config/database.config');

// cors

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.set('activeUsers', activeUsers)
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
const port = 8000;

// https://www.geeksforgeeks.org/how-to-manage-users-in-socket-io-in-node-js/
// https://www.geeksforgeeks.org/express-js-app-set-function/
// https://www.codershood.info/2016/01/24/sending-message-specific-user-socket-io/#:~:text=To%20send%20a%20message%20to,send%20a%20message%20to%20user1.

const server = app.listen(port, () => console.log(`Listening on port: ${port}`) );

const io = require('socket.io')(server, { cors: true });
// app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    req.io = io;
    next()
})

io.on('connection', socket => {
    // when create new poll
    // 
    console.log('on-connection')
    app.set('socket', socket)
    // console.log(socket.handshake.query.userId)
    console.log('userId: ', socket.handshake.query.userId)
    console.log('socket', socket.id)
    activeUsers.addUser(socket.handshake.query.userId, socket)
    
    // console.log(activeUsers.getUserSocketId())
    socket.emit('stablish-connection', 'Connection established')

    socket.on('disconnect', () => {
        console.log('disconnection')
        if(activeUsers.removeUser(socket.handshake.query.userId)){
            console.log('user has been removed from list')
        }else{
            console.log('cannott remove user from list')
        }
    })
})

app.use('/', api)