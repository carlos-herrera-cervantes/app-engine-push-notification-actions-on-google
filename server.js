'use strict';

const express = require('express');
const dotenv = require('dotenv');
const { notificationRouter } = require('./Routes/notification-routes');

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use('/api/v1/notifications', notificationRouter);

app.listen(port, _ => console.info('Server listen on port: ', port));