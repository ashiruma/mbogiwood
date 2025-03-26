from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

# MySQL Database Connection
db = mysql.connector.connect(
    host="localhost",
    user="root",          # Use your correct username
    password="BrianKimayio@2255",  # Use your actual password
    database="mbogiwood_db"
)
cursor = db.cursor()

@app.route('/')
def home():
    return "Welcome to Mbogiwood Productions API!"

@app.route('/subscriptions', methods=['GET'])
def get_subscriptions():
    cursor.execute("SELECT * FROM subscriptions")
    subscriptions = cursor.fetchall()
    return jsonify(subscriptions)

@app.route('/pay', methods=['POST'])
def make_payment():
    data = request.json
    user_id = data.get("user_id")
    subscription_id = data.get("subscription_id")
    amount = data.get("amount")
    mpesa_code = data.get("mpesa_code")
    
    query = "INSERT INTO payments (user_id, subscription_id, amount, payment_status, mpesa_code) VALUES (%s, %s, %s, 'Pending', %s)"
    cursor.execute(query, (user_id, subscription_id, amount, mpesa_code))
    db.commit()
    
    return jsonify({"message": "Payment initiated!"})

if __name__ == '__main__':
    app.run(debug=True)
