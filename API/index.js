const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fetch = require("node-fetch");
const config = require('./config.json');
require("dotenv").config();

const authRouter = require('./routers/auth');
const calendarsRouter = require('./routers/calendars');
const eventsRouter = require('./routers/events');
const usersRouter = require('./routers/users');

const PORT = config.port || 3000;

const server = express();

server.use(express.json());
server.use(cors({origin: `http://localhost:3000`, credentials: true }));
server.use(express.urlencoded({extended: true}));
server.use(cookieParser());

server.use('/api/auth', authRouter);
server.use('/api/calendars', calendarsRouter);
server.use('/api/events', eventsRouter);
server.use('/api/users', usersRouter);
server.get('/api/holiday', getHoliday);

async function getHoliday(req, res) {
    try {
        let country = "UA";
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        const response = await fetch(`https://holidays.abstractapi.com/v1/?api_key=${config.HOLIDAY_API_KEY}&country=${country}&year=${year}&month=${month + 1}&day=${day}`);
        const data = await response.json();

        if(data && data[0]) {
            res.json(data[0]);
        }
        else {
            res.json({});
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

server.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`)
});