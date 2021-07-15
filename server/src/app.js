require("module-alias/register");

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const requestLogger = require("morgan");
const appRoutes = require("@api/routes");
const stripeWebhooks = require("@api/controllers/stripe");
const { apiPrefix } = require("@config");

require("@config/loaders/mongoose");

const app = express();
app.post("/webhook", express.raw({ type: "application/json" }), stripeWebhooks);

app.use(cors());
app.use(cookieParser());
app.use(requestLogger("dev"));
app.enable("trust proxy");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/status", (req, res) => {
  res.status(200).end();
});

app.use(apiPrefix, appRoutes());

module.exports = app;
