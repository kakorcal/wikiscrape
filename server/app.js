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

  socket.on('generate article', PATH=>{
    let title, content, linkTags, scriptTags, styles, scripts;
    let uri = PATH ? `${BASE_URL}${PATH}` : `${BASE_URL}${RANDOM_PAGE}`;

    rp({uri, transform: body=>cheerio.load(body)})
      .then($=>{
        title = $('#firstHeading').html();
        content = $('#bodyContent').html()
            .replace(/href=('|"|‘|’|“|”)\/wiki\/.+?('|"|‘|’|“|”)/g, match=>{
              return `href='foo' ng-click=(vm.generateArticle(${match.substring(5, match.length)}))`;
            });
        
        linkTags = $("link[rel='stylesheet']").map((idx, elem)=>{
          return rp(`${BASE_URL}${elem.attribs.href}`);
        }).get();        

        return Promise.all(linkTags);
      })
      .then(stylesheets=>{
        styles = stylesheets.join('');
        socket.emit('receive article', {title, content, styles});
      })
      .catch(err=>{
        socket.emit('Error', 'Failed To Retrieve Data');
      });

      //***************************************************************************
        // don't need scripts for now
          // scriptTags = $('head script[src]').map((idx, elem)=>{
          //   return rp(`${BASE_URL}${elem.attribs.src}`);
          // }).get();
        // .then(javascripts=>{
        //   scripts = javascripts.join('');
        //   socket.emit('receive article', {title, content, styles, scripts});
        // })
      //***************************************************************************
  });   

  socket.on('disconnect', ()=>{
    console.log('CLIENT DISCONNECT');
  });
});
