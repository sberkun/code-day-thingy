'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use(express.static(path.join(__dirname, 'frontend')))
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });
const peoples = {};
//const updateGame = require('./backend/game.js').exportFunction(peoples);
//const person = require('./backend/player.js').exportFunction;

wss.on('connection', (ws) => {
  ws.id = Math.random();
  peoples[ws.id] = 7;//new person(ws);
  ws.on('message',(message) => {
    console.log(message);
    //peoples[ws.id].update(message.data);
  });
  ws.on('close', ()=> delete peoples[ws.id]);
});

//setInterval(updateGame, 20);
