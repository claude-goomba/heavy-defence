

from flask import Flask, request, jsonify
import stripe
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Use environment variables for Stripe key and public URLs
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')
PUBLIC_URL = os.environ.get('PUBLIC_URL', 'https://your-domain.com')
stripe.api_key = STRIPE_SECRET_KEY

@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    data = request.json
    item_type = data.get('type')
    price = 1000 if item_type == 'game' else 500
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': 'Super Curl Games - ' + ('Full Game' if item_type == 'game' else 'DLC'),
                    },
                    'unit_amount': price,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f'{PUBLIC_URL}/success',
            cancel_url=f'{PUBLIC_URL}/cancel',
        )
        return jsonify({'id': session.id, 'url': session.url})
    except Exception as e:
        return jsonify(error=str(e)), 400

@app.route('/success')
def success():
    return 'Payment successful!'

@app.route('/cancel')
def cancel():
    return 'Payment cancelled.'

if __name__ == '__main__':
    app.run(port=5000, debug=True)
