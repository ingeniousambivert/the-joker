const SubscriptionService = require("@services/subscription");
const logger = require("@helpers/logger");
const UserModel = require("@models/users");

const subscriptionService = new SubscriptionService();

async function stripeWebhooks(req, res) {
  try {
    const event = await subscriptionService.Webhook(
      req.body,
      req.header("Stripe-Signature")
    );

    const data = event.data.object;

    switch (event.type) {
      case "customer.subscription.created": {
        const user = await UserModel.findOne({ customerID: data.customer });
        if (user) {
          console.log("Creating Subscription");
          if (data.plan.id == process.env.PRODUCT_BASIC) {
            user.productID = process.env.PRODUCT_BASIC;
            user.plan = "basic";
          }

          if (data.plan.id === process.env.PRODUCT_PRO) {
            user.productID = process.env.PRODUCT_PRO;
            user.plan = "pro";
          }

          user.subscriptionStatus = "active";

          await user.save();
        } else {
          logger.error("stripeWebhooks: User not found");
        }
        break;
      }

      case "customer.subscription.updated": {
        const user = await UserModel.findOne({ customerID: data.customer });
        if (user) {
          console.log("Updating Subscription");

          if (data.plan.id == process.env.PRODUCT_BASIC) {
            user.productID = process.env.PRODUCT_BASIC;
            user.plan = "basic";
          }

          if (data.plan.id === process.env.PRODUCT_PRO) {
            user.productID = process.env.PRODUCT_PRO;
            user.plan = "pro";
          }
          user.subscriptionStatus = "active";

          if (data.canceled_at) {
            console.log("Cancelling Subscription");

            user.subscriptionStatus = "cancelled";
            user.subscriptionID = null;
            user.productID = null;
            user.plan = "free";
          }

          await user.save();
        } else {
          logger.error("stripeWebhooks: User not found");
        }
        break;
      }

      case "customer.subscription.deleted": {
        const user = await UserModel.findOne({ customerID: data.customer });
        if (user) {
          console.log("Deleting Subscription");

          user.subscriptionStatus = "cancelled";
          user.subscriptionID = null;
          user.productID = null;
          user.plan = "free";

          await user.save();
        } else {
          logger.error("stripeWebhooks: User not found");
        }
        break;
      }

      default:
        break;
    }
    res.sendStatus(200);
  } catch (error) {
    logger.error(`stripeWebhooks:${error.message}`);
    res.sendStatus(500);
  }
}

module.exports = stripeWebhooks;
