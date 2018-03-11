// just a working example
$( function() { 

  var handler = StripeCheckout.configure({
    key: 'pk_test_p0IVFfbBJjsNyOLWioaLRpWW',
    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    token: function(token) {
      // You can access the token ID with `token.id`.
      // Get the token ID to your server-side code for use.
    }
  });

  document.getElementById( 'instformContentBtPay' ).addEventListener('click', function(e) {
    // Open Checkout with further options:
    handler.open({
      name: 'ma-ha',
      description: '2 widgets',
      currency: 'eur',
      amount: 2000
    });
    e.preventDefault();
  });

  // Close Checkout on page navigation:
  window.addEventListener('popstate', function() {
    handler.close();
  });
});
