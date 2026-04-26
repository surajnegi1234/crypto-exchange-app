class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

class BadRequestError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
  }
}

class ExternalServiceError extends AppError {
  constructor(message) {
    super(message, 502);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  ExternalServiceError,
  NotFoundError,
};
