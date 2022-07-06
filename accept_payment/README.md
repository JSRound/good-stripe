# [Accept Payment](https://stripe.com/docs/payments/accept-a-payment?platform=web)

¿Qué es lo fundamental de este ejemplo?
Este es un ejemplo basico para crear un pago. 
Con estos conocimientos se pueden crear cosas mas complicadas después.

Pasos:
1. Necesitamos la clave privada de Stripe para crear este pago.
2. Con la clave privada inicializamos Stripe
`const stripe = require('stripe')(private_test_key);`
3. Si usamos la clave de test, los pagos no se terminan de cargar pero el resto funciona igual, lo cual es muy útil.
4. Necesitamos un endpoint en el que crear una checkout session de Stripe y que redirige a session.url
```javascript
app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    ...
    success_url: 'http://localhost:4242/success',
    cancel_url: 'http://localhost:4242/cancel'
  });

  res.redirect(303, session.url);
});
```
5. Hay que rellenar la checkout session con [diferentes parametros](https://stripe.com/docs/api/checkout/sessions/create).
Los más importantes son:
```javascript
{
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
}

```
 <details><summary>mode - REQUIRED CONDITIONALLY</summary>

The mode of the Checkout Session.Required when using prices or setup mode. 
Pass subscription if the Checkout Session includes at least one recurring item.

Possible enum values   
---
`payment`
Accept one-time payments for cards, iDEAL, and more.
---
`setup`
Save payment details to charge your customers later.
---
`subscription`
Use Stripe Billing to set up fixed-price subscriptions.
---

</details>

<details><summary>currency & country codes</summary>

[Currency codes](https://www.iso.org/iso-4217-currency-codes.html)
[Country codes](https://www.iso.org/obp/ui/#search)
[Supported currencies](https://stripe.com/docs/currencies)
Importante: el codigo debe ir en minisculas y el amount debe ir sin decimales 3.9€ = 390

La cantidad minima a cargar en euros es 
`EUR	€0.50`

1. Se abre una pagina de stripe para el pago
2. Cuando realizamos el pago nos lleva a la pagina de success si ha salido bien o a la de cancel si el pago de ha rechazado
3. Si hay un error, no redirige a la pagina de cancel. Muestra el error (bastante completo) por consola.