const express = require("express");
const authRouter = require("@api/routes/auth");
const usersRouter = require("@api/routes/users");
const jokesRouter = require("@api/routes/jokes");
const subscriptionRouter = require("@api/routes/subscription");

const app = express.Router();

module.exports = () => {
  authRouter(app);
  usersRouter(app);
  jokesRouter(app);
  subscriptionRouter(app);
  return app;
};
