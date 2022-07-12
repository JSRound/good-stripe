// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

const express = require('express');
const app = express();
const test_key =
  'STRIPE_TEST_API_KEY';
const stripe = require('stripe')(test_key);
app.get('/', (req, res) => {
  res.sendFile('./index.html', { root: __dirname });
});
app.get('/success', (req, res) => {
  res.sendFile('./success.html', { root: __dirname });
});
app.get('/cancel', (req, res) => {
  res.sendFile('./cancel.html', { root: __dirname });
});

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Viaje ZMove'
          },
          unit_amount: 390
        },
        quantity: 1
      }
    ],
    mode: 'payment',
    locale: 'es',
    tax_id_collection: {
      enabled: true
    },
    success_url: 'http://localhost:4242/success',
    cancel_url: 'http://localhost:4242/cancel'
  });

  res.redirect(303, session.url);
});

app.listen(4242, () => console.log(`Listening on port http://localhost:4242/ !`));
