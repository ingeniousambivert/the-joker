const express = require("express");
const { secureRoute } = require("@api/middlewares");
const { GetJokes } = require("@api/controllers/jokes");

const route = express.Router();

module.exports = (app) => {
  app.use("/jokes", route);

  route.post("/", secureRoute, GetJokes);
};
