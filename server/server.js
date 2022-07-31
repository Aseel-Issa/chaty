const cookieParser = require('cookie-parser');
require('dotenv').config();
const express = require('express');
const api = require('./routes/api')
const cors = require('cors')
const activeUsers = require('./socket/users.socket')
require('./config/database.config');

// setting up server
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.set('activeUsers', activeUsers)
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
const port = 8000;

const server = app.listen(port, () => console.log(`Listening on port: ${port}`) );

const io = require('socket.io')(server, { cors: true });
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    // attach socket io with each request, in order to use it in api routes
    req.io = io;
    next()
})

io.on('connection', socket => {
    console.log('on-connection')
    app.set('socket', socket)
    console.log('userId: ', socket.handshake.query.userId)
    console.log('socket', socket.id)
    // add any user who connects to our server to active users list
    activeUsers.addUser(socket.handshake.query.userId, socket)
    // send message to client that he has been successfully connected to server
    socket.emit('stablish-connection', 'Connection established')

    socket.on('disconnect', () => {
        console.log('disconnection')
        // remove user from active users list once he disconnect from server
        if(activeUsers.removeUser(socket.handshake.query.userId)){
            console.log('user has been removed from list')
        }else{
            console.log('cannott remove user from list')
        }
    })
})
// add routes to server
app.use('/', api)