﻿var WebSocketServer = require('ws').Server;
wss = new WebSocketServer({ port: 12000 });
console.log('Server is working');
wss.on('connection', function (ws) {
    var danmakus = ['测试弹幕111111111111',
        '测试弹幕22222222222222222222222222222',
        '测试弹幕333',
        '测试弹幕444444444444444444',
        '测试弹幕55555555',
        '测试弹幕666666666666666666666',
        '测试弹幕7777777777777',
        '测试弹幕88888888888888888888888888888888888',
        '测试弹幕6666666666666666666666',
        '测试弹幕7777777777777',
        '测试弹幕22222222222222222222222222222',
        '测试弹幕333',
        '测试弹幕444444444444444444',
        '测试弹幕55555555',
        '测试弹幕6666666666666666666666',]
    var counter = 0;
    var timer = setInterval(() =>{
        counter++;
        if (counter >20) {
            clearInterval(timer);
        }
        ws.send('弹幕弹幕弹幕弹幕弹幕弹幕弹幕弹幕弹幕弹幕弹幕弹幕弹幕弹幕弹幕弹幕弹幕弹幕' + counter);
    },20)
    console.log('connected');
})