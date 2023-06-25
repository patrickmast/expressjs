import express from 'express';
import cors from 'cors';

export const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

const urlDatabase = {};

// Custom function to generate short IDs
function generateShortId() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let shortId = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    shortId += chars.charAt(randomIndex);
  }

  return shortId;
}

// Endpoint to shorten a URL
app.post('/shorten', (req, res) => {
  const longUrl = req.body.url;
  const shortUrl = generateShortId();

  urlDatabase[shortUrl] = longUrl;
  console.log('longUrl:', longUrl);
  console.log('urlDatabase(1):', urlDatabase);

  return res.status(201).send({ shortUrl });
});

// Endpoint to redirect a short URL to the original URL
app.get('/go/*', (req, res) => {
  const shortUrl = req.params[0];
  const longUrl = urlDatabase[shortUrl];

  console.log('urlDatabase(2):', urlDatabase);

  if (!longUrl) {
    return res.status(404).send({ error: "Short URL '" + shortUrl + "' not found" });
  }

  return res.redirect(301, longUrl);
});

// Healthcheck endpoint
app.get('/', (req, res) => {
  res.status(200).send({ status: 'Connected. Welcome!' });
});

export default app;
