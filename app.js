const express = require('express');
const path = require('node:path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rfs = require('rotating-file-stream'); // version 2.x

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('combined'));

// Create a daily rotating log
let accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
})

app.use(logger('combined', { stream: accessLogStream }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;

// CSP //
/*
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self' *.croomssched.tech croomssched.glitch.me *.weather.gov *.statuspage.io googleads.g.doubleclick.net; img-src *; media-src *; script-src 'self' *.croomssched.tech pagead2.googlesyndication.com croomssched.statuspage.io unsafe-inline; style-src: 'self' *.croomssched.tech unsafe-inline; frame-src: 'self' *.croomssched.tech *.kones.tech *.google.com; connect-src: pagead2.googlesyndication.com"
        }*/