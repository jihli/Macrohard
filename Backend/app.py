from flask import Flask, render_template
from db import get_db_connection  # Import the connection function

app = Flask(__name__, template_folder='../frontend')

@app.route('/')
def index():
    # Get the database connection
    connection = get_db_connection()

    # Create a cursor object to interact with the database
    cursor = connection.cursor()

    # get transactions information
    cursor.execute("SELECT * FROM transactions")
    allTransactions = cursor.fetchall()
    
    #get recurring transactions
    cursor.execute("""
        SELECT recurring_id, account_id, category_id, flow_type, amount, 
               start_date, frequency, end_date, note
        FROM recurring_transactions
    """)
    allRecurringTransactions = cursor.fetchall()
    
    #get holding
    cursor.execute("""
        SELECT holding_id, account_id, product_code, product_name, asset_type, 
               quantity, unit_cost
        FROM holdings
    """)
    allHoldings = cursor.fetchall()
    
    #get holding prive
    cursor.execute("""
        SELECT holding_id, price_date, close_price
        FROM holding_prices
    """)
    holdingPrices = cursor.fetchall()

    #get budgets
    cursor.execute("""
        SELECT budget_id, category_id, period_start, budget_amount, alert_threshold, budget_name
        FROM budgets
    """)
    budgets = cursor.fetchall()
    
    # get networth daily
    cursor.execute("""
        SELECT snapshot_date, net_worth
        FROM networth_daily
    """)
    networthDaily = cursor.fetchall()
    
    # Close the cursor and connection
    cursor.close()
    connection.close()

    # Render the results in a template (optional)
    return render_template('index.html', allTransactions = allTransactions, 
                           allRecurringTransactions=allRecurringTransactions,
                           allHoldings = allHoldings,
                           holdingPrices = holdingPrices,
                           budgets = budgets,
                           networthDaily = networthDaily)

if __name__ == '__main__':
    app.run(debug=True)
