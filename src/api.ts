import express from 'express';
import cors from 'cors';
import shortid from 'shortid';

export const app = express();

app.use(cors({ origin: true }));

app.use(express.json());

const urlDatabase = {};

// Endpoint to shorten a URL
app.post('/shorten', (req, res) => {
  const longUrl = req.body.url;
  const shortUrl = shortid.generate();

  urlDatabase[shortUrl] = longUrl;

  res.status(201).send({ shortUrl });
});

// Endpoint to redirect a short URL to the original URL
app.get('/:shortUrl', (req, res) => {
  const { shortUrl } = req.params;
  const longUrl = urlDatabase[shortUrl];

  if (!longUrl) {
    return res.status(404).send({ error: 'Short URL not found' });
  }

  res.redirect(301, longUrl);
});

// Healthcheck endpoint
app.get('/', (req, res) => {
  res.status(200).send({ status: 'Connected. Welcome!' });
});

export default app;
