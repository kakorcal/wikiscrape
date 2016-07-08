const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cheerio = require('cheerio');
const rp = require('request-promise');
const BASE_URL = 'https://en.wikipedia.org';
const RANDOM_PAGE = '/wiki/Special:RandomInCategory/Featured_articles';
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

  socket.on('generate random', ()=>{
    let title, content, links, styles, scripts;
    rp({uri: `${BASE_URL}${RANDOM_PAGE}`, transform: body=>cheerio.load(body)})
      .then($=>{
        title = $('#firstHeading').html();
        content = $('#bodyContent').html();
        // content = $('#content').html();

        links = $("link[rel='stylesheet']").map((idx, elem)=>{
          return rp(`${BASE_URL}${elem.attribs.href}`);
        }).get();        

        scripts = $('head script').filter((idx, elem)=>{
          // keep this to handle error
          // let sub = $(elem).attr('src').substring(0,4);
          return $(elem).attr('src');
        }).get();

        return Promise.all(links);
      })
      .then(stylesheets=>{
        styles = stylesheets.join('');
        socket.emit('receive article', {title, content, styles});
      })
      .catch(err=>{
        socket.emit('Error', 'Failed To Retrieve Data');
      });
  });   

  socket.on('disconnect', ()=>{
    console.log('CLIENT DISCONNECT');
  });
});
