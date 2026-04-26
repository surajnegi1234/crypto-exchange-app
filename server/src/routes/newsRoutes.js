const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { getCryptoNews } = require("../services/newsService");

const router = express.Router();

router.get(
  "/news",
  asyncHandler(async (_req, res) => {
    const data = await getCryptoNews();
    res.json({ data });
  })
);

module.exports = router;
