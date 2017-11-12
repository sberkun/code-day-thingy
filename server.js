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
var buildingCosts = [15,97,1057,11528,124878,1344835,19211921,316996684,4899039651,72044700750,960596010000,13448344140000,163301321700000,2017251621000000,24975496259999996];
                            console.log(buildingCosts[7]);
var sendOBJ = {
  score1:0,score2:0,cps1:0,cps2:0,
  ppl:peoples,
  u1:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  u2:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
};
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
      
      if(peoples[aa]['u']===0){}else{
        var cooost = buildingCosts[Math.abs(peoples[aa]['u'])-1];
        console.log(Math.abs(peoples[aa]['u'])-1);
        console.log(cooost);
        if(peoples[aa]['u']<0&&sendOBJ.score1>=cooost){
          sendOBJ.score1-=cooost;
          sendOBJ.cps1+=cooost/100;
        }
        if(peoples[aa]['u']>0&&sendOBJ.score2>=cooost){
          sendOBJ.score2-=cooost;
          sendOBJ.cps2+=cooost/100;
        }  
      }
      
    }
    
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(sendOBJ));
    });
}, 20);
