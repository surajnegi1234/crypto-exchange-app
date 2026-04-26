const axios = require("axios");
const {
  BadRequestError,
  ExternalServiceError,
  NotFoundError,
} = require("../utils/apiError");

const client = axios.create({
  baseURL:
    process.env.COIN_GECKO_BASE_URL || "https://api.coingecko.com/api/v3",
  timeout: 15000,
  headers: {
    accept: "application/json",
  },
});

const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

const allowedCurrencies = new Set(["inr", "usd", "eur"]);
const allowedDays = new Set([
  "24h",
  "7d",
  "14d",
  "30d",
  "60d",
  "200d",
  "1y",
  "max",
]);

function readCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function writeCache(key, value) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

function validateId(id) {
  if (!id || typeof id !== "string" || !id.trim()) {
    throw new BadRequestError("A valid coin id is required");
  }
  return id.trim().toLowerCase();
}

function normalizeCurrency(value) {
  const currency = String(value || "inr").toLowerCase();
  if (!allowedCurrencies.has(currency)) {
    throw new BadRequestError("Currency must be one of: inr, usd, eur");
  }
  return currency;
}

function normalizePage(value) {
  const page = Number.parseInt(value || "1", 10);
  if (!Number.isInteger(page) || page < 1) {
    throw new BadRequestError("Page must be a positive integer");
  }
  return page;
}

function normalizePerPage(value) {
  const perPage = Number.parseInt(value || "24", 10);
  if (!Number.isInteger(perPage) || perPage < 1 || perPage > 250) {
    throw new BadRequestError("perPage must be between 1 and 250");
  }
  return perPage;
}

function normalizeChartDays(value) {
  const days = String(value || "24h");
  if (!allowedDays.has(days)) {
    throw new BadRequestError(
      "days must be one of: 24h, 7d, 14d, 30d, 60d, 200d, 1y, max",
    );
  }
  if (days === "24h") return "1";
  if (days === "1y") return "365";
  return days.replace("d", "");
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestWithCache(cacheKey, requestFn, retries = 2) {
  const cached = readCache(cacheKey);
  if (cached) return cached;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const { data } = await requestFn();
      writeCache(cacheKey, data);
      return data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new NotFoundError("Requested crypto resource was not found");
      }
      if (error.response && error.response.status === 429 && attempt < retries) {
        await sleep(2000 * (attempt + 1));
        continue;
      }
      if (attempt === retries) {
        throw new ExternalServiceError("CoinGecko API request failed");
      }
    }
  }
}

async function getCoinsMarket({ currency, page, perPage }) {
  return requestWithCache(`markets:${currency}:${page}:${perPage}`, () =>
    client.get("/coins/markets", {
      params: {
        vs_currency: currency,
        page,
        per_page: perPage,
        order: "market_cap_desc",
        sparkline: false,
        price_change_percentage: "24h",
      },
    }),
  );
}

async function getCoinById(id) {
  const coinId = validateId(id);
  return requestWithCache(`coin:${coinId}`, () =>
    client.get(`/coins/${coinId}`),
  );
}

async function getCoinChart({ id, currency, days }) {
  const coinId = validateId(id);
  return requestWithCache(`chart:${coinId}:${currency}:${days}`, () =>
    client.get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: currency,
        days,
      },
    }),
  );
}

const FALLBACK_EXCHANGES = [
  { id: "binance", name: "Binance", trust_score_rank: 1, url: "https://www.binance.com", image: "https://assets.coingecko.com/markets/images/52/small/binance.jpg" },
  { id: "coinbase", name: "Coinbase Exchange", trust_score_rank: 2, url: "https://www.coinbase.com", image: "https://assets.coingecko.com/markets/images/23/small/Coinbase_Coin_Primary.png" },
  { id: "kraken", name: "Kraken", trust_score_rank: 3, url: "https://www.kraken.com", image: "https://assets.coingecko.com/markets/images/29/small/kraken.jpg" },
  { id: "kucoin", name: "KuCoin", trust_score_rank: 4, url: "https://www.kucoin.com", image: "https://assets.coingecko.com/markets/images/61/small/kucoin.jpg" },
  { id: "bybit_spot", name: "Bybit", trust_score_rank: 5, url: "https://www.bybit.com", image: "https://assets.coingecko.com/markets/images/698/small/bybit_spot.png" },
  { id: "okex", name: "OKX", trust_score_rank: 6, url: "https://www.okx.com", image: "https://assets.coingecko.com/markets/images/96/small/WeChat_Image_20220117220452.png" },
  { id: "gate", name: "Gate.io", trust_score_rank: 7, url: "https://www.gate.io", image: "https://assets.coingecko.com/markets/images/60/small/gate_io_logo1.jpg" },
  { id: "bitfinex", name: "Bitfinex", trust_score_rank: 8, url: "https://www.bitfinex.com", image: "https://assets.coingecko.com/markets/images/4/small/BItfinex.png" },
  { id: "mexc", name: "MEXC", trust_score_rank: 9, url: "https://www.mexc.com", image: "https://assets.coingecko.com/markets/images/409/small/MEXC_logo_square.jpeg" },
  { id: "htx", name: "HTX", trust_score_rank: 10, url: "https://www.htx.com", image: "https://assets.coingecko.com/markets/images/25/small/huobi.jpg" },
  { id: "bitstamp", name: "Bitstamp", trust_score_rank: 11, url: "https://www.bitstamp.net", image: "https://assets.coingecko.com/markets/images/9/small/bitstamp.jpg" },
  { id: "gemini", name: "Gemini", trust_score_rank: 12, url: "https://www.gemini.com", image: "https://assets.coingecko.com/markets/images/50/small/gemini.jpg" },
  { id: "bitget", name: "Bitget", trust_score_rank: 13, url: "https://www.bitget.com", image: "https://assets.coingecko.com/markets/images/591/small/bitget.png" },
  { id: "wazirx", name: "WazirX", trust_score_rank: 14, url: "https://wazirx.com", image: "https://assets.coingecko.com/markets/images/302/small/wazirx.jpg" },
  { id: "coindcx", name: "CoinDCX", trust_score_rank: 15, url: "https://coindcx.com", image: "https://assets.coingecko.com/markets/images/478/small/CoinDCX.png" },
];

async function getExchanges() {
  try {
    return await requestWithCache("exchanges", () =>
      client.get("/exchanges", { params: { per_page: 50 } })
    );
  } catch {
    return FALLBACK_EXCHANGES;
  }
}

module.exports = {
  getCoinById,
  getCoinChart,
  getCoinsMarket,
  getExchanges,
  normalizeChartDays,
  normalizeCurrency,
  normalizePage,
  normalizePerPage,
};
