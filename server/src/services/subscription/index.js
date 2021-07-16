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
            expand: ["pending_setup_intent"],
            trial_period_days: process.env.TRIAL_DAYS,
          });

          await UserModel.findOneAndUpdate(
            { email },
            { subscriptionID: subscription.id }
          );
          resolve({
            subscriptionId: subscription.id,
            clientSecret: subscription.pending_setup_intent.client_secret,
          });
        } else {
          logger.error(
            "SubscriptionService.Create: Product price ids missing in env"
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
      const { email, plan } = params;
      let priceId = null;
      if (plan === "basic") {
        priceId = process.env.PRODUCT_BASIC;
      } else if (plan === "pro") {
        priceId = process.env.PRODUCT_PRO;
      }
      try {
        const user = await UserModel.findOne({ email });
        const { subscriptionID } = user;
        if (subscriptionID) {
          const subscription = await Stripe.subscriptions.retrieve(
            subscriptionID
          );
          const updatedSubscription = await Stripe.subscriptions.update(
            subscriptionID,
            {
              cancel_at_period_end: false,
              items: [
                {
                  id: subscription.items.data[0].id,
                  price: priceId,
                },
              ],
            }
          );
          resolve(updatedSubscription);
        } else {
          logger.error(
            "SubscriptionService.Update: User missing subsciption ID"
          );
          reject(400);
        }
      } catch (error) {
        console.log(error.message);
        logger.error("SubscriptionService.Update", error);
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
          await Stripe.subscriptions.del(subscriptionID);
          resolve(200);
        } else {
          logger.error(
            "SubscriptionService.Delete: User missing subsciption ID"
          );
          reject(400);
        }
      } catch (error) {
        logger.error("SubscriptionService.Delete", error);
        reject(500);
      }
    });
  }

  async Webhook(rawBody, stripeSign) {
    const event = Stripe.webhooks.constructEvent(
      rawBody,
      stripeSign,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    return event;
  }
}

module.exports = SubscriptionService;
