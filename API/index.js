const express = require("express");
const cookieParser = require('cookie-parser');
require("dotenv").config();

const authRouter = require('./routers/auth');
const calendarsRouter = require('./routers/calendars');

const PORT = process.env.PORT || 3000;

const server = express();

server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use(cookieParser());

server.use('/api/auth', authRouter);
server.use('/api/calendars', calendarsRouter);

server.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`)
});