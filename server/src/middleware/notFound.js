const { NotFoundError } = require("../utils/apiError");

function notFound(_req, _res, next) {
  next(new NotFoundError("Route not found"));
}

module.exports = { notFound };
