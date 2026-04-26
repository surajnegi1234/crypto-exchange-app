# Xcrypto Pro

Full-stack crypto exchange dashboard built with React, Chakra UI, and a Node.js/Express backend.

## What it does

- Shows live coin market data and exchange listings.
- Displays detailed coin pages with price charts and market statistics.
- Uses a Node backend as the API layer instead of calling CoinGecko directly from the browser.
- Includes validation, centralized error handling, rate limiting, caching, and production-ready security middleware.

## Tech Stack

- Frontend: React, Chakra UI, Framer Motion, Chart.js
- Backend: Node.js, Express, Axios
- Security: Helmet, CORS, rate limiting, compression
- Data source: CoinGecko API through the backend

## Project Structure

```text
src/            React frontend
server/         Express backend
public/         Static assets
```

## Environment Variables

Create a `.env` file in the project root.

Required values:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:3000
REACT_APP_API_BASE_URL=http://localhost:5000/api
COIN_GECKO_BASE_URL=https://api.coingecko.com/api/v3
NODE_ENV=development
```

## Install

```bash
npm install
```

## Run in Development

Start both frontend and backend together:

```bash
npm run dev
```

Run only the backend:

```bash
npm run server
```

Run only the frontend:

```bash
npm start
```

## Build for Production

```bash
npm run build
```

Then start the backend in production mode:

```bash
$env:NODE_ENV="production"; node server/index.js
```

The server will serve the React build when `NODE_ENV=production`.

## API Endpoints

- `GET /api/health` - health check
- `GET /api/coins?currency=inr&page=1&perPage=24` - coin market list
- `GET /api/coins/:id` - coin details
- `GET /api/coins/:id/chart?currency=inr&days=24h` - coin market chart
- `GET /api/exchanges` - exchange list

## Validation and Safety

- Input validation on currency, page, per-page, and chart range values.
- Centralized JSON error responses.
- Cache layer for repeated CoinGecko requests.
- Rate limiting and standard security headers.

## Notes for College Submission

- The frontend and backend are separated but run from one repository.
- The backend acts as an API gateway, which is a better production pattern than exposing third-party APIs directly to the browser.
- Add your own screenshots and deployment links before final submission.
