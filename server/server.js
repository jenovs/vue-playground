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
      res.send(getContent(text, req.params.term));
    })
    .catch(err => {
      res.send(`<div>Failed to fetch.<br>${err}.<br>Try again later</div>`);
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
      res.send(getContent(text, req.params.term));
    })
    .catch(err => {
      res.send(`<div>Failed to fetch.<br>${err}.<br>Try again later</div>`);
    });
});

function getContent(text, term) {
  const $ = cheerio.load(text);

  const content = $('#content-area .snippets').html();

  return !content.length
    ? `<div>Search term not found: "${term}"</div>`
    : content;
}

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
