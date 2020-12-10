const express = require('express');
const app = express();

server = app.listen(3001,function(){
    console.log('serve is running on port 3001')
});

const io=require('socket.io')(server);
io.on('connection',function(socket){
    console.log(socket.id)
})