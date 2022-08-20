const User = require("../models/user");

class MainError extends Error {
  constructor(errorMessage, errorType = "") {
    super();
    this.name = this.constructor.name;
    this.errorMessage = errorMessage;
    switch (this.constructor.name) {
      case "AuthenticationError":
        if (errorType === "401") {
          this.statusCode = 401;
        } else if (errorType === "404") {
          this.statusCode = 404;
        } else {
          this.statusCode = 400;
        }
        break;
      case "UserError":
        if (errorType === "404") {
          this.statusCode = 404;
        } else if (errorType === "409") {
          this.statusCode = 409;
        } else {
          this.statusCode = 400;
        }
        break;
      case "PostError":
        if (errorType === "403") {
          this.statusCode = 403;
        } else {
          this.statusCode = 404;
        }
        break;
      case "LikeError":
        if (errorType === "409") {
          this.statusCode = 409;
        } else {
          this.statusCode = 404;
        }
        break;
      case "DislikeError":
        if (errorType === "409") {
          this.statusCode = 409;
        } else {
          this.statusCode = 404;
        }
        break;
      case "RequestError":
        this.statusCode = 400;
        break;
      default:
        this.statusCode = 500;
    }
  }
}

class AuthenticationError extends MainError {}
class UserError extends MainError {}
class PostError extends MainError {}
class LikeError extends MainError {}
class DislikeError extends MainError {}
class RequestError extends MainError {}

module.exports = {
  MainError,
  AuthenticationError,
  UserError,
  PostError,
  LikeError,
  DislikeError,
  RequestError,
};
