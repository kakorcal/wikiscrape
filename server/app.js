const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cheerio = require('cheerio');
const request = require('request');
const BASE_URL = 'https://www.wikipedia.org/';
const RANDOM_PAGE = 'Special:RandomInCategory/Featured_articles';
const PORT = process.env.PORT || 5000;

app.use(require('morgan')('dev'));
app.use('/javascripts', express.static(`${__dirname}/../client/javascripts`));
app.use('/stylesheets', express.static(`${__dirname}/../client/stylesheets`));
app.use('/views', express.static(`${__dirname}/../client/views`));
app.use('/libs', express.static(`${__dirname}/../client/libs`));

app.get('*', (req, res)=>{
  res.sendFile('/views/layout.html', {root: './client'});
});

server.listen(PORT, ()=>{
  console.log(`Listening to port ${PORT}`);
});

io.on('connection', socket=>{
  console.log('CLIENT HANDSHAKE');

  socket.on('disconnect', ()=>{
    console.log('CLIENT DISCONNECT');
  });
});
