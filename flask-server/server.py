
# Import flask and datetime module for showing date and time
from flask import Flask, jsonify, request
import datetime
from flask_cors import CORS
import yfinance as yf
from datetime import datetime, date, timedelta
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import relationship
from uuid import uuid4
import os

db = SQLAlchemy()

app = Flask(__name__)
# Apply CORS globally to all routes
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:MrFineDance2023!@db.wtmkydezphxkqejbjjrp.supabase.co:5432/postgres"

app.secret_key = 'mrFineDance'

db.init_app(app)

class User(db.Model):
    __tablename__ = "user"
    username = db.Column(db.String(255), primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    name = db.Column(db.String(255))
    password = db.Column(db.String(255), nullable=False)
    date_of_birth = db.Column(db.Date)
    about = db.Column(db.Text)
    security_question = db.Column(db.String(255), nullable=False)
    security_answer = db.Column(db.String(255), nullable=False)

class Stock(db.Model):
    __tablename__ = "stock"
    stock_symbol = db.Column(db.String(255), primary_key=True)
    stock_name = db.Column(db.String(255), nullable=False, unique=True)
    current_price = db.Column(db.Float)
    datetime_of_price = db.Column(db.DateTime)

class LogBuy(db.Model):
    __tablename__ = "logBuy"
    transaction_id = db.Column(db.String(255), primary_key=True)
    shares = db.Column(db.Float)
    username = db.Column(db.String(255), db.ForeignKey(User.username), nullable=False)
    stock_symbol = db.Column(db.String(255), nullable=False)
    stock_name = db.Column(db.String(255), nullable=False)
    buy_price = db.Column(db.Float)
    buy_date = db.Column(db.Date)
    notes = db.Column(db.Text)

    User_username = relationship('User', foreign_keys=[username])


class LogSell(db.Model):
    __tablename__ = "logSell"
    receipt_id = db.Column(db.String(255), primary_key=True)
    shares = db.Column(db.Float)
    basis = db.Column(db.Float)
    username = db.Column(db.String(255), db.ForeignKey(User.username), nullable=False)
    stock_symbol = db.Column(db.String(255), nullable=False)
    stock_name = db.Column(db.String(255), nullable=False)
    sell_price = db.Column(db.Float)
    sell_date = db.Column(db.Date)
    notes = db.Column(db.Text)

    User_username = relationship('User', foreign_keys=[username])

class Search(db.Model):
    __tablename__ = "search"
    username = db.Column(db.String(255), db.ForeignKey(User.username), nullable=False, primary_key=True)
    stock_symbol = db.Column(db.String(255), db.ForeignKey(Stock.stock_symbol), nullable=False, primary_key=True)
    stock_name = db.Column(db.String(255), db.ForeignKey(Stock.stock_name), nullable=False)
    datetime_of_search = db.Column(db.DateTime, nullable=False, primary_key=True)

    User_username = relationship('User', foreign_keys=[username])
    Stock_stock_symbol = relationship('Stock', foreign_keys=[stock_symbol])
    Stock_stock_name = relationship('Stock', foreign_keys=[stock_name])

@app.route("/signup", methods=["POST"])
def signup():
    username = request.json["username"]
    email = request.json["email"]
    password = request.json["password"]
    securityQuestion = request.json["selectedOption"]
    securityAnswer = request.json["securityAnswer"]

    # Check if the username or email already exist
    existing_user = User.query.filter_by(username=username).first()
    existing_email = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({"error": "Username already in use!"})
    if existing_email:
        return jsonify({"error": "Email already in use!"})

    # Create a new User object
    new_user = User(
        username=username,
        email=email,
        password=password,
        security_question=securityQuestion,
        security_answer=securityAnswer
    )

    # Add the new user to the SQLAlchemy session and commit the changes
    db.session.add(new_user)
    db.session.commit()
    
    with open('.usr', 'w') as file:
        file.write(username)

    return jsonify({
        "username": username,
        "email": email,
        "password": password,
        "selectedOption": securityQuestion,
        "securityAnswer": securityAnswer
    })
    
@app.route("/TrackBuy", methods=["POST", "GET"])
def logBuy():
    if request.method == "POST":
        with open('.usr', 'r') as file:
            username = file.read()
        if username != "None":
            shares = request.json["shares"]
            stock_symbol = request.json["stockSymbol"]
            stock_name = request.json["stockName"]
            buy_price = request.json["buyPrice"]
            buy_date = request.json["buyDate"]
            notes = request.json["notes"]

            #logBuyDaily = logBuyDailyInfo(username)
            current_date = date.today()
            transaction_id = "B-" + str(current_date) + "-" + str(uuid4())

            new_log_buy = LogBuy(
                transaction_id=transaction_id,
                shares=shares,
                username=username,
                stock_symbol=stock_symbol,
                stock_name=stock_name,
                buy_price=buy_price,
                buy_date=buy_date,
                notes=notes
            )

            db.session.add(new_log_buy)
            db.session.commit()

            return jsonify({
                "shares": shares,
                "stockSymbol": stock_symbol,
                "stockName": stock_name,
                "buyPrice": buy_price,
                "buyDate": buy_date,
                "notes": notes
            })
            
    if request.method == "GET":
        with open('.usr', 'r') as file:
            username = file.read()
        if username != "None":
            # Query the database to retrieve buy transactions associated with the user
            buy_transactions = db.session.query(LogBuy).filter(LogBuy.username == username).all()
            
            #if not buy_transactions:
            #    return jsonify({"message": "No buy transactions found for this user"})
            
            buy_transactions_data = [{"transaction_id": buy.transaction_id, "shares": buy.shares, "stock_symbol": buy.stock_symbol, "stock_name": buy.stock_name, "buy_price": buy.buy_price, "buy_date": buy.buy_date, "notes": buy.notes} for buy in buy_transactions]
            return jsonify(buy_transactions_data)
        
    return jsonify({"message": "Invalid request or error occurred"})

def logBuyDailyInfo(username):
    current_date = date.today()
    tempID = "B-" + str(current_date) + "%"

    # Query the database using SQLAlchemy
    count = db.session.query(func.count(LogBuy.transaction_id)).filter(
        LogBuy.username == username,
        LogBuy.transaction_id.like(tempID)
    ).scalar()

    return count + 1
  
@app.route("/TrackSell", methods=["POST", "GET"])
def logSell():
    if request.method == "POST":
        with open('.usr', 'r') as file:
            username = file.read()
        if username != "None":
            shares = request.json["shares"]
            basis = request.json["basis"]
            stock_symbol = request.json["stockSymbol"]
            stock_name = request.json["stockName"]
            sell_price = request.json["sellPrice"]
            sell_date = request.json["sellDate"]
            notes = request.json["notes"]

            #logSellDaily = logSellDailyInfo(username)
            current_date = date.today()
            receipt_id = "B-" + str(current_date) + "-" + str(uuid4())

            new_log_sell = LogSell(
                receipt_id=receipt_id,
                shares=shares,
                username=username,
                stock_symbol=stock_symbol,
                stock_name=stock_name,
                sell_price=sell_price,
                sell_date=sell_date,
                notes=notes,
                basis=basis
            )

            db.session.add(new_log_sell)
            db.session.commit()

            return jsonify({
                "shares": shares,
                "basis": basis,
                "stockSymbol": stock_symbol,
                "stockName": stock_name,
                "sellPrice": sell_price,
                "sellDate": sell_date,
                "notes": notes
            })
            
            
    if request.method == "GET":
        with open('.usr', 'r') as file:
            username = file.read()
        if username != "None":
            # Query the database to retrieve sell transactions associated with the user
            sell_transactions = db.session.query(LogSell).filter(LogSell.username == username).all()
            
            #if not sell_transactions:
            #   return jsonify({"message": "No sell transactions found for this user"})
            
            sell_transactions_data = [{"receipt_id": sell.receipt_id, "shares": sell.shares, "basis": sell.basis, "stock_symbol": sell.stock_symbol, "stock_name": sell.stock_name, "sell_price": sell.sell_price, "sell_date": sell.sell_date, "notes": sell.notes} for sell in sell_transactions]
            return jsonify(sell_transactions_data)

    return jsonify({"message": "Invalid request or error occurred"})
def logSellDailyInfo(username):
    current_date = date.today()
    tempID = "S-" + str(current_date) + "%"
    # Query the database using SQLAlchemy
    count = db.session.query(func.count(LogSell.receipt_id)).filter(
        LogSell.username == username,
        LogSell.receipt_id.like(tempID)
    ).scalar()
    return count + 1

@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    user = User.query.filter_by(username=username).first()

    if user is None:
        print("Username or password does not exist")
        return jsonify({"error": "Username does not exist!"})
    elif user.password == password:
        print("Success")
        with open('.usr', 'w') as file:
            file.write(username)
        return 'User logged in'
    else:
        print("Username or password does not exist")
        return jsonify({"error": "Wrong Password!"})
    
def get_stock_data(symbol):
    latest_price = None
    try:
        stock_data = yf.Ticker(symbol)
        latest_price = stock_data.history(period="1d")['Close'].iloc[0]
    except Exception as e:
        print(f"An error occurred for {symbol}: {str(e)}")
    return latest_price

def insert_stocks():
    Stock.query.delete()
    db.session.commit()
    stocks = [
        Stock(stock_symbol='AAPL', stock_name='Apple Inc.'),
        Stock(stock_symbol='MSFT', stock_name='Microsoft Corp'),
        Stock(stock_symbol='AMZN', stock_name='Amazon.com, Inc.'),
        Stock(stock_symbol='TSLA', stock_name='Tesla, Inc.'),
        Stock(stock_symbol='NVDA', stock_name='NVIDIA Corporation'),
        Stock(stock_symbol='AMD', stock_name='Advanced Micro Devices, Inc.'),
        Stock(stock_symbol='GOOGL', stock_name='Alphabet Inc.'),
        Stock(stock_symbol='META', stock_name='META Platforms Inc'),
        Stock(stock_symbol='NFLX', stock_name='Netflix, Inc.'),
        Stock(stock_symbol='INTC', stock_name='Intel Corporation')
    ]
    db.session.add_all(stocks)
    db.session.commit()

def update_stock_prices():
    stocks = Stock.query.all()

    for stock in stocks:
        latest_price = get_stock_data(stock.stock_symbol)
        latest_price = round(latest_price, 2)
        
        if latest_price is not None:
            stock.current_price = latest_price
            stock.datetime_of_price = datetime.now()
    
    db.session.commit()


@app.route("/", methods=["POST"])
def top_stocks():
    with app.app_context():
        top_5_stocks = Stock.query.order_by(Stock.current_price.desc()).limit(5).all()
    top_5_stocks_data = [(stock.stock_symbol, stock.stock_name, stock.current_price, stock.datetime_of_price) for stock in top_5_stocks]
    return jsonify(top_5_stocks_data)

@app.route("/HomeLoggedIn", methods=["POST"])
def top_stocks_Logged_In():
    with app.app_context():
        top_5_stocks = Stock.query.order_by(Stock.current_price.desc()).limit(5).all()
    top_5_stocks_data = [(stock.stock_symbol, stock.stock_name, stock.current_price, stock.datetime_of_price) for stock in top_5_stocks]
    with open('.usr', 'r') as file:
        username = file.read()
    response_data = {
        "top_5_stocks_data": top_5_stocks_data,
        "username": username
    }
    return jsonify(response_data)

@app.route('/getHistoricalData', methods=['GET'])
def get_historical_data():
    try:
        symbol = request.args.get('symbol')

        # Fetch historical data from Yahoo Finance
        stock = yf.Ticker(symbol)
        historical_data = stock.history(period='max')

        # Convert historical data to a format suitable for the frontend
        historical_data_dict = {
            'timestamp': historical_data.index.strftime('%Y-%m-%d').tolist(),
            'indicators': {
                'quote': [{'close': close} for close in historical_data['Close'].tolist()],
            }
        }

        return jsonify(historical_data_dict)

    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/logout', methods=['GET'])
def logout():
    with open('.usr', 'r') as file:
        username = file.read()
    os.remove(".usr")
    response_data = {"message":"Successfully logged out"}
    return jsonify(response_data)

@app.route('/getSecurityQuestion', methods=['POST'])
def getSecurityQuestion():
    data = request.json
    username = data["username"]
    email = data["email"]

    # Check if both username and email exist together in the database
    user = User.query.filter_by(username=username, email=email).first()

    if user:
        # If the user exists, return the security question
        return jsonify({'username': user.username, 'securityQuestion': user.security_question})
    else:
        # If the user does not exist, return an appropriate response
        return jsonify({'error': 'User not found'}), 404

@app.route('/ForgotPassword', methods=['POST'])
def forgotPassword():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    security_answer = data.get('answer')
    new_password = data.get('newPassword')
    
    # 1. Fetch the user based on the provided username and email
    user = User.query.filter_by(username=username, email=email).first()

    if user:
        # 2. Verify the security question answer
        if user.security_answer == security_answer:
            # 3. Update the user's password
            user.password = new_password
            db.session.commit()
            return jsonify({'message': 'Password updated successfully'})
        else:
            return jsonify({'error': 'Incorrect security answer'}), 400
    else:
        return jsonify({'error': 'User not found'}), 404
    
@app.route('/SearchStock', methods=['POST'])
def searchStockValue():
    data = request.json
    stock_symbol = data.get('symbol')

    print(stock_symbol)

    if stock_symbol:
        # Assuming Stock is the SQLAlchemy model
        stock = Stock.query.filter_by(stock_symbol=stock_symbol).first()

        if stock:
            # Assuming you want to display stock information like stock name and current price
            stock_info = {
                'stock_symbol': stock.stock_symbol,
                'stock_name': stock.stock_name,
                'current_price': stock.current_price,
                'datetime_of_price': str(stock.datetime_of_price),  # Convert datetime to string for JSON serialization
            }

            return jsonify({'stockValue': stock_info})
        else:
            return jsonify({'error': 'Stock not found'}), 404
    else:
        return jsonify({'error': 'Stock symbol not provided'}), 400




if __name__ == '__main__':
    with open('.usr', 'w') as file:
        file.write("None")
    with app.app_context(): 
        insert_stocks()
        update_stock_prices()
    app.run(debug=True)