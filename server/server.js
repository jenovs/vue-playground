const fetch = require('node-fetch');
const express = require('express');
const cheerio = require('cheerio');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

app.get('/nl/:term', (req, res) => {
  fetch(
    `https://www.vandale.nl/gratis-woordenboek/nederlands/betekenis/${
    req.params.term
    }`
  )
    .then(res => res.text())
    .then(text => {
      const $ = cheerio.load(text);
      res.send($('#content-area .snippets').html());
    });
});

app.get('/en/:term', (req, res) => {
  fetch(
    `https://www.vandale.nl/gratis-woordenboek/nederlands-engels/vertaling/${
    req.params.term
    }`
  )
    .then(res => res.text())
    .then(text => {
      const $ = cheerio.load(text);
      res.send($('#content-area .snippets').html());
    });
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
