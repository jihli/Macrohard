import requests
from bs4 import BeautifulSoup
from flask import Flask, render_template, redirect, url_for, request, jsonify
from db import get_db_connection  # Import the connection function
import mysql.connector
from decimal import Decimal

app = Flask(__name__, template_folder='../Frontend/public')

@app.route('/')
def index():
    return redirect(url_for('API'))  # Redirect to '/api'

# route to investments
@app.route('/api/investments')
def investmentsAPI():
    # Fetch data by calling the functions with the cursor
    allInvestment, investmentSummary = getInvestmentsInfo()
    # Render the results in a template
    return render_template('test.html', 
                           investments=allInvestment, investmentSummary = investmentSummary)

# get investments information from db
def getInvestmentsInfo():
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT 
    h.holding_id AS id,
    h.user_id AS userId,
    h.product_name AS name,
    h.asset_type AS type,
    h.quantity AS shares,
    h.unit_cost AS purchasePrice,
    hp.close_price AS currentPrice,
    h.unit_cost * h.quantity AS totalInvested,
    h.quantity * hp.close_price AS currentValue,
    (hp.close_price - h.unit_cost) / h.unit_cost * 100 AS `return`,
    'medium' AS riskLevel,
    8.5 AS expectedReturn,
    '2023-06-01T00:00:00Z' AS purchaseDate,
    SUM(h.quantity * hp.close_price) OVER () AS totalValue,
    SUM(h.quantity * h.unit_cost) OVER () AS totalInvested,
    SUM(h.quantity * hp.close_price) OVER () - SUM(h.quantity * h.unit_cost) OVER () AS totalGain
FROM 
    holdings h
JOIN 
    holding_prices hp ON h.holding_id = hp.holding_id
WHERE 
    hp.price_date = (SELECT MAX(price_date) FROM holding_prices WHERE holding_id = h.holding_id);
                   
    """)

    # Fetch all rows and convert each row to a dictionary
    result = cursor.fetchall()

     # Close the cursor and connection after all queries
    cursor.close()
    connection.close()
    # Field names (columns) to use as keys
    field_names = ['id', 'userId', 'name', 'type', 'shares', 'purchasePrice', 'currentPrice', 
                   'totalInvested', 'currentValue', 'return', 'riskLevel', 'expectedReturn', 'purchaseDate', 
                   'totalValue', 'totalInvested', 'totalGain']

    # Convert tuples to dictionaries
    formatted_investments = [
        dict(zip(field_names, row))  # Create dictionary with field names and corresponding values
        for row in result
    ]

    # Calculate the summary data
    totalValue = sum(investment['currentValue'] for investment in formatted_investments)
    totalInvested = sum(investment['totalInvested'] for investment in formatted_investments)
    totalGain = sum(investment['totalGain'] for investment in formatted_investments)

    # Calculate totalReturn (as a percentage)
    totalReturn = (totalValue - totalInvested) / totalInvested * 100

    # Calculate returnPercentage (average return of all investments)
    returnPercentage = sum(investment['return'] for investment in formatted_investments) / len(formatted_investments)

    # Build the summary dictionary
    summary = {
        'totalValue': totalValue,
        'totalInvested': totalInvested,
        'totalGain': totalGain,
        'totalReturn': totalReturn,
        'returnPercentage': returnPercentage
    }

    return formatted_investments, summary

#add investment to db
@app.route('/api/investments', methods=['POST'])
def addInvestment():
    # Get JSON data from the request
    data = request.get_json()

    # Validate required fields
    required_fields = ['name', 'type', 'amount', 'shares', 'purchasePrice', 'purchaseDate', 'riskLevel', 'expectedReturn']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400

    # Extract data from request
    name = data['name']
    investment_type = data['type']
    amount = data['amount']
    shares = data['shares']
    purchase_price = data['purchasePrice']
    purchase_date = data['purchaseDate']
    risk_level = data['riskLevel']
    expected_return = data['expectedReturn']

    # Get DB connection
    connection = get_db_connection()
    cursor = connection.cursor()

    # SQL Query to insert new investment
    try:
        cursor.execute("""
            INSERT INTO holdings (user_id, product_name, asset_type, quantity, unit_cost, account_id)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (1, name, investment_type, shares, purchase_price, 12))  # Assuming user_id is 1 for simplicity

        # Commit transaction
        connection.commit()

        # Get the ID of the inserted investment (if needed for response)
        investment_id = cursor.lastrowid

        # Close the cursor and connection
        cursor.close()
        connection.close()

        # Respond with the investment data and success message
        return jsonify({
            'message': 'Investment added successfully',
            'investment': {
                'id': investment_id,
                'name': name,
                'type': investment_type,
                'amount': amount,
                'shares': shares,
                'purchasePrice': purchase_price,
                'purchaseDate': purchase_date,
                'riskLevel': risk_level,
                'expectedReturn': expected_return
            }
        }), 201

    except Exception as e:
        # Handle any errors that occur during the database insertion
        connection.rollback()
        return jsonify({'error': str(e)}), 500

#tax
@app.route('/api/tax_summary', methods=['GET'])
def getTaxSummary():
    # Connect to the database
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # 1. Fetch total annual income (sum of all 'Income' transactions)
        cursor.execute("""
            SELECT SUM(amount) AS annual_income
            FROM transactions
            WHERE flow_type = 'Income'
        """)
        result = cursor.fetchone()
        annual_income = result['annual_income'] if result['annual_income'] else 0

        # 2. Define the estimated tax rate (can be stored or hardcoded)
        estimated_tax_rate = Decimal('0.15')

        # 3. Calculate the estimated tax (based on annual income and the estimated tax rate)
        estimated_tax = annual_income * estimated_tax_rate

        # 4. Fetch the paid tax (for simplicity, hardcoded or can come from user data)
        paid_tax = 18240  # Example value

        # 5. Calculate the tax difference
        difference = estimated_tax - paid_tax

        # 6. Determine the status (underpaid, overpaid, etc.)
        status = "underpaid" if paid_tax < estimated_tax else "overpaid"

        # 9. Build the response data
        response_data = {
            "annualIncome": str(annual_income),
            "estimatedTaxRate": estimated_tax_rate * 100,
            "paidTax": paid_tax,
            "estimatedTax": str(estimated_tax),
            "difference": str(difference),
            "status": status,
        }

        return response_data

    except mysql.connector.Error as e:
        return f"Error: {str(e)}"

    finally:
        cursor.close()
        conn.close()


@app.route('/api/news', methods=['GET'])
def newsAPI():
    headlines = getNews()
    if isinstance(headlines, str):  # Check if it's an error message
        return render_template('error.html', error_message=headlines)
    return render_template('index.html', headlines=headlines)

def getNews():
    url = 'http://feeds.bbci.co.uk/news/rss.xml'
    response = requests.get(url)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        headlines = []
        for item in soup.find_all('item'):
            headline = item.title.get_text()
            headlines.append(headline)
        
        if not headlines:
            return "No headlines found."
        return headlines
    else:
        return f"Failed to retrieve news. Status code: {response.status_code}"


# Main route
@app.route('/api')
def API():
    # Fetch data by calling the functions with the cursor
    # allInvestment, investmentSummary = getInvestmentsInfo()
    # Render the results in a template
    # return render_template('test.html', 
    #                        investments=allInvestment, investmentSummary = investmentSummary)
    # return render_template('test_add_investment.html')
    # headlines = getNews()
    # if isinstance(headlines, str):  # If an error occurred
    #     return render_template('error.html', error_message=headlines)
    # return render_template('test_news.html', headlines=headlines)
    response_data = getTaxSummary()
    print(response_data)
    return render_template('test_taxSummary.html', data=response_data)

if __name__ == '__main__':
    app.run(debug=True)
