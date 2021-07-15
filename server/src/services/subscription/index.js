const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const logger = require("@helpers/logger");
const UserModel = require("@models/users");

class SubscriptionService {
  async Create(params) {
    return new Promise(async (resolve, reject) => {
      const { email, customerId, plan } = params;
      let priceId = null;
      if (plan === "basic") {
        priceId = process.env.PRODUCT_BASIC;
      } else if (plan === "pro") {
        priceId = process.env.PRODUCT_PRO;
      }
      try {
        if (priceId) {
          const subscription = await Stripe.subscriptions.create({
            customer: customerId,
            items: [
              {
                price: priceId,
              },
            ],
            payment_behavior: "default_incomplete",
            expand: ["latest_invoice.payment_intent"],
          });

          await UserModel.findOneAndUpdate(
            { email },
            { subscriptionID: subscription.id }
          );

          resolve({
            subscriptionId: subscription.id,
            clientSecret:
              subscription.latest_invoice.payment_intent.client_secret,
          });
        } else {
          logger.error(
            "SubscriptionService.Create",
            "Product price ids missing in env"
          );
          reject(400);
        }
      } catch (error) {
        logger.error("SubscriptionService.Create", error);
        reject(500);
      }
    });
  }

  async Update(params) {
    return new Promise(async (resolve, reject) => {
      const { email } = params;
      try {
        const { subscriptionID } = await UserModel.findOne({ email });
        if (subscriptionID) {
          const deletedSubscription = await Stripe.subscriptions.del(
            subscriptionID
          );
          await UserModel.findOneAndUpdate({ email }, { subscriptionID: null });
          resolve(200);
        } else {
          logger.error(
            "SubscriptionService.Delete",
            "User missing subsciption ID"
          );
          reject(400);
        }
      } catch (error) {
        logger.error("SubscriptionService.Delete", error);
        reject(500);
      }
    });
  }

  async Delete(params) {
    return new Promise(async (resolve, reject) => {
      const { email } = params;
      try {
        const { subscriptionID } = await UserModel.findOne({ email });
        if (subscriptionID) {
          const deletedSubscription = await Stripe.subscriptions.del(
            subscriptionID
          );
          await UserModel.findOneAndUpdate({ email }, { subscriptionID: null });
          resolve(200);
        } else {
          logger.error(
            "SubscriptionService.Delete",
            "User missing subsciption ID"
          );
          reject(400);
        }
      } catch (error) {
        logger.error("SubscriptionService.Delete", error);
        reject(500);
      }
    });
  }
}

module.exports = SubscriptionService;
