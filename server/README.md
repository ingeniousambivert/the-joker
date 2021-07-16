
# the-joker
A minimal app that will tell you jokes based on your subscription

## About

This project uses [Express](https://expressjs.com/). Fast, unopinionated, minimalist web framework for Node.js. It provides a REST API with JWT based authentication and basic user management (verify-email, forgot-password) and Stripe Subscriptions and Webhooks.


## Getting Started

Getting up and running is simple.

1. Make sure you have [NodeJS](https://nodejs.org/), [npm](https://www.npmjs.com/), [Redis](https://redis.io/) and [MongoDB](https://www.mongodb.com/) installed in your system globally.
2. Install your dependencies.

```bash
cd path/to/server
npm install
```
****
3.1 Start your server.

```bash
npm start
```

3.2 Start your server in development mode.

```bash
npm run dev
```

4. Configuring the server with environment variables

   - Create a `.env` file in the root
   - Add the following lines to it (modify according to your environment/requirements)

   ```env
      # Express Server config
      PORT=8000

      # API config
      API_PREFIX=/api

      # MongoDB config
      MONGO_PORT=27017
      MONGO_HOST=127.0.0.1
      MONGO_DATABASE=express-starter
      # if any 
      MONGO_USERNAME=your-username
      MONGO_PASSWORD=your-password

      # Redis config
      REDIS_PORT=6379
      REDIS_HOST=127.0.0.1
      # if any 
      REDIS_PASSWORD=your-password

      # JWT config
      # Do not use the sample string below, to get a hex string run: openssl rand -hex 32
      ACCESS_TOKEN_SECRET=b970aded3f8731894204ea5cc127756b197925591281a2c7538660b99791b984
      REFRESH_TOKEN_SECRET=f820f7853587aa1f1f75f4040750199825cc1cc7cf4a26bc95212423c76224ef
      EXPIRY_AFTER=1d

      # Node Mailer config
      GMAIL_USERNAME=your-username
      GMAIL_PASSWORD=your-password

      # Client URL - For mails 
      CLIENT_URL=http://127.0.0.1:3000

      # Stripe config
      STRIPE_SECRET_KEY=sk_test_f820f7853587aa1f1f75f4040750199825cc1cc7cf4a26bc95212423c76224ef
      PRODUCT_BASIC=price_f820f7853587
      PRODUCT_PRO=price_f820f7853587
      STRIPE_WEBHOOK_SECRET=whsec_820f7853587aa1f1f75f404075019

   ```

   By default the *mailer* works with the [SMTP Transport](https://www.npmjs.com/package/nodemailer-smtp-transport) configured with Gmail. But you can use any supported [transports](https://nodemailer.com/transports/).

## Set up Stripe

1. Create a new Stripe account [here](https://dashboard.stripe.com/register).
2. Copy Secret Key under Developers > API Keys and paste in .env file as the STRIPE_SECRET_KEY.


## Add products: Basic and Pro

1. Add a new product by clicking on the `Product` button on the left side. Call the first one, Product – Basic. Set the Pricing and `Recurring`. Set the Billing period to `Monthly`.


2. Copy the Price API ID and assign it to PRODUCT_BASIC in the .env file.

3. Repeat the process above for Product – Pro at, `Recurring`, and `Monthly`.

4. Copy the Price API ID and assign it to PRODUCT_PRO in the .env file.



## Set up the Stripe Webhook

Download Stripe CLI.

```bash
stripe listen --forward-to localhost:8000/webhook
```

Copy the webhook secret and assign it to STRIPE_WEBHOOK_SECRET in .env file.
