const express = require("express");
const { secureRoute } = require("@api/middlewares");
const {
  CreateSubscription,
  DeleteSubscription,
} = require("@api/controllers/subscription");

const route = express.Router();

module.exports = (app) => {
  app.use("/subscription", route);

  route.post("/create", secureRoute, CreateSubscription);

  route.post("/delete", secureRoute, DeleteSubscription);
};
