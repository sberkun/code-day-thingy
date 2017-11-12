module.exports.exportFunction = function(peoples){
  return function(){

    var sendOBJ = {score1:0,score2:0,ppl:peoples};
    
    for(var aa in peoples){
      sendOBJ.score1+=peoples[aa]['a'];
      sendOBJ.score2+=peoples[aa]['b'];
    }
    
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(sendOBJ));
    });
    
  };
};
