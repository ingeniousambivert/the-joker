const createError = require("http-errors");
const SubscriptionService = require("@services/subscription");

const subscriptionService = new SubscriptionService();

async function CreateSubscription(req, res) {
  try {
    const { email, customerId, plan } = req.body;
    if (email && customerId && plan) {
      const result = await subscriptionService.Create({
        email,
        customerId,
        plan,
      });
      res.status(200).json(result);
    } else {
      res.status(400).send(createError(400));
    }
  } catch (error) {
    res.status(error).send(createError(error));
  }
}

async function DeleteSubscription(req, res) {
  try {
    const { email } = req.body;
    if (email) {
      const result = await subscriptionService.Delete({ email });
      res.sendStatus(result);
    } else {
      res.status(400).send(createError(400));
    }
  } catch (error) {
    res.status(error).send(createError(error));
  }
}

module.exports = { CreateSubscription, DeleteSubscription };
