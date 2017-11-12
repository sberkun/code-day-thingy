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
var sendOBJ = {score1:0,score2:0,cps1:0,cps2:0,ppl:peoples};
wss.on('connection', (ws) => {
  ws.id = Math.random();
  peoples[ws.id] = {a:0,b:0,x:0,y:0};
  ws.on('message',(message) => {
    peoples[ws.id] = JSON.parse(message);
  });
  ws.on('close', ()=> delete peoples[ws.id]);
});

setInterval(function(){    
    for(var aa in peoples){
      sendOBJ.score1+=peoples[aa]['a'];
      sendOBJ.score2+=peoples[aa]['b'];
    }
    
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(sendOBJ));
    });
}, 20);
