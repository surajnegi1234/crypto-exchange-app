const express = require("express");
const { protect } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");
const { BadRequestError, NotFoundError } = require("../utils/apiError");

const router = express.Router();
router.use(protect);

// ── Portfolio ──────────────────────────────────────────────
router.get(
  "/portfolio",
  asyncHandler(async (req, res) => {
    res.json({ data: req.user.portfolio });
  })
);

router.post(
  "/portfolio",
  asyncHandler(async (req, res) => {
    const { coinId, name, symbol, image, quantity, buyPrice } = req.body;
    if (!coinId || !name || !symbol || quantity == null || buyPrice == null) {
      throw new BadRequestError("coinId, name, symbol, quantity and buyPrice are required");
    }
    const existing = req.user.portfolio.find((p) => p.coinId === coinId);
    if (existing) {
      existing.quantity = Number(quantity);
      existing.buyPrice = Number(buyPrice);
    } else {
      req.user.portfolio.push({ coinId, name, symbol, image, quantity: Number(quantity), buyPrice: Number(buyPrice) });
    }
    await req.user.save();
    res.json({ data: req.user.portfolio });
  })
);

router.delete(
  "/portfolio/:coinId",
  asyncHandler(async (req, res) => {
    const before = req.user.portfolio.length;
    req.user.portfolio = req.user.portfolio.filter(
      (p) => p.coinId !== req.params.coinId
    );
    if (req.user.portfolio.length === before) {
      throw new NotFoundError("Coin not found in portfolio");
    }
    await req.user.save();
    res.json({ data: req.user.portfolio });
  })
);

// ── Watchlist ──────────────────────────────────────────────
router.get(
  "/watchlist",
  asyncHandler(async (req, res) => {
    res.json({ data: req.user.watchlist });
  })
);

router.post(
  "/watchlist",
  asyncHandler(async (req, res) => {
    const { coinId, name, symbol, image } = req.body;
    if (!coinId || !name || !symbol) {
      throw new BadRequestError("coinId, name and symbol are required");
    }
    const exists = req.user.watchlist.find((w) => w.coinId === coinId);
    if (!exists) {
      req.user.watchlist.push({ coinId, name, symbol, image });
      await req.user.save();
    }
    res.json({ data: req.user.watchlist });
  })
);

router.delete(
  "/watchlist/:coinId",
  asyncHandler(async (req, res) => {
    const before = req.user.watchlist.length;
    req.user.watchlist = req.user.watchlist.filter(
      (w) => w.coinId !== req.params.coinId
    );
    if (req.user.watchlist.length === before) {
      throw new NotFoundError("Coin not found in watchlist");
    }
    await req.user.save();
    res.json({ data: req.user.watchlist });
  })
);

module.exports = router;
