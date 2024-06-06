require('dotenv').config()
const express = require('express');
const cors = require('cors')
const app = express();
const http = require('http');
const { Server } = require('socket.io')
const {socketIO} = require('./socket/socket');
const imageAuth = require('./middleware/imageAuth')
app.use(express.json())
app.use(cors())


app.use(imageAuth, express.static('public'));

const authRoute = require('./routes/auth');
const userDataRoute = require('./routes/data');
const socketRoute = require('./routes/socket');

app.use('/auth', authRoute);
app.use('/data', userDataRoute);
app.use('/socket', socketRoute);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
})

socketIO(io);

server.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}`)
});

