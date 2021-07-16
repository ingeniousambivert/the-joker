# the-joker
A minimal app that will tell you jokes based on your subscription

## About

This project uses [Vite](https://vitejs.dev/) with [React](https://reactjs.org/) and [Stripe-React-JS](https://github.com/stripe/react-stripe-js)


## Getting Started

Getting up and running is simple.

1. Make sure you have [NodeJS](https://nodejs.org/), [npm](https://www.npmjs.com/) installed in your system globally.
2. Install your dependencies.

```bash
cd path/to/client
npm install
```


3 Start your server.

```bash
npm run dev
```

4. Configuring the server with environment variables

   - Create a `.env` file in the root
   - Add the following lines to it (modify according to your environment/requirements)

   ```env
      # Axios Client Config
        VITE_API_URL=http://localhost:8000/api
      # Stripe Config
        VITE_STRIPE_PUBLISHABLE_KEY=pk_test_f820f7853587aa1f1f75f4040750199825cc1cc7cf4a26bc95212423c76224ef
   ```

