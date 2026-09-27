// StockViewer Backend
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;
const API_KEY = process.env.FINNHUB_API_KEY;

app.use(cors());

if (!API_KEY) {
  console.error("FEHLER: FINNHUB_API_KEY fehlt in der .env Datei.");
  process.exit(1);
}

app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Suchbegriff fehlt." });
  }

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Suche fehlgeschlagen." });
  }
});

app.get("/api/stock/:symbol", async (req, res) => {
  const { symbol } = req.params;

  try {
    const [quoteRes, profileRes] = await Promise.all([
      fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`),
      fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`)
    ]);

    const quote = await quoteRes.json();
    const profile = await profileRes.json();

    res.json({ quote, profile });
  } catch (err) {
    res.status(500).json({ error: "Daten konnten nicht geladen werden." });
  }
});

app.listen(PORT, () => {
  console.log(`StockViewer Backend läuft auf http://localhost:${PORT}`);
});