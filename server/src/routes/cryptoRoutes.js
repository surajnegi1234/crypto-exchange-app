const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  getCoinById,
  getCoinChart,
  getCoinsMarket,
  getExchanges,
  normalizeChartDays,
  normalizeCurrency,
  normalizePage,
  normalizePerPage,
} = require("../services/coinGeckoService");

const router = express.Router();

router.get(
  "/coins",
  asyncHandler(async (req, res) => {
    const currency = normalizeCurrency(req.query.currency);
    const page = normalizePage(req.query.page);
    const perPage = normalizePerPage(req.query.perPage);
    const data = await getCoinsMarket({ currency, page, perPage });
    res.json({ data });
  }),
);

router.get(
  "/coins/:id",
  asyncHandler(async (req, res) => {
    const data = await getCoinById(req.params.id);
    res.json({ data });
  }),
);

router.get(
  "/coins/:id/chart",
  asyncHandler(async (req, res) => {
    const currency = normalizeCurrency(req.query.currency);
    const days = normalizeChartDays(req.query.days);
    const data = await getCoinChart({ id: req.params.id, currency, days });
    res.json({ data });
  }),
);

router.get(
  "/exchanges",
  asyncHandler(async (_req, res) => {
    const data = await getExchanges();
    res.json({ data });
  }),
);

module.exports = router;
