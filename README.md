# StockViewer

A simple web app that shows real-time stock prices for US companies 
using the Finnhub API. You can search by name or ticker, or use the 
quick-select buttons for popular stocks.

## What it shows

- Current price and daily change (green/red)
- Opening price, daily high and low
- Quick buttons for 14 popular stocks (Apple, Tesla, Nvidia, etc.)

## Setup

1. Get a free API key at [finnhub.io](https://finnhub.io)
2. In the `backend` folder, rename `.env.example` to `.env` and paste your key in
3. In the `backend` folder, run `npm install` then `npm start`
4. Open `index.html` with your browser

> Note: Only US stocks are supported. European stocks may be added later.

## Challenges & Learnings

Earlier versions of this project exposed the API key directly in frontend code. I knew this wasn't ideal, but didn't yet have the backend skills to fix it properly. I've since revoked that API key and learned Node.js to rebuild this project with a minimal Express backend that keeps the API key server-side. Now the API key is never sent to the browser. This was a deliberate step to finally apply what I learned about not exposing secrets in public repos.