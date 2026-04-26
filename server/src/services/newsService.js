const axios = require("axios");
const { ExternalServiceError } = require("../utils/apiError");

const newsClient = axios.create({
  baseURL: "https://newsdata.io/api/1",
  timeout: 10000,
});

const newsCache = new Map();
const NEWS_TTL_MS = 5 * 60 * 1000;

function readCache(key) {
  const entry = newsCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    newsCache.delete(key);
    return null;
  }
  return entry.value;
}

function writeCache(key, value) {
  newsCache.set(key, { value, expiresAt: Date.now() + NEWS_TTL_MS });
}

async function getCryptoNews(category = "top") {
  const key = `news:${category}`;
  const cached = readCache(key);
  if (cached) return cached;

  try {
    const { data } = await newsClient.get("/latest", {
      params: {
        apikey: process.env.NEWSDATA_API_KEY,
        q: "cryptocurrency OR bitcoin OR crypto",
        language: "en",
        category: "business,technology",
      },
    });

    const results = (data.results || []).slice(0, 20).map((item) => ({
      id: item.article_id || item.link,
      title: item.title,
      url: item.link,
      source: item.source_id || "Unknown",
      publishedAt: item.pubDate,
      description: item.description || "",
      image: item.image_url || null,
    }));

    writeCache(key, results);
    return results;
  } catch (err) {
    throw new ExternalServiceError("Failed to fetch crypto news");
  }
}

module.exports = { getCryptoNews };
