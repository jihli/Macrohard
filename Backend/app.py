from flask import Flask, render_template
from db import get_db_connection  # Import the connection function

app = Flask(__name__, template_folder='../frontend')

# Function to fetch all transactions
def get_all_transactions(cursor):
    cursor.execute("SELECT * FROM transactions")
    return cursor.fetchall()

# Function to fetch recurring transactions
def get_all_recurring_transactions(cursor):
    cursor.execute("""
        SELECT recurring_id, account_id, category_id, flow_type, amount, 
               start_date, frequency, end_date, note
        FROM recurring_transactions
    """)
    return cursor.fetchall()

# Function to fetch holdings
def get_all_holdings(cursor):
    cursor.execute("""
        SELECT holding_id, account_id, product_code, product_name, asset_type, 
               quantity, unit_cost
        FROM holdings
    """)
    return cursor.fetchall()

# Function to fetch holding prices
def get_all_holding_prices(cursor):
    cursor.execute("""
        SELECT holding_id, price_date, close_price
        FROM holding_prices
    """)
    return cursor.fetchall()

# Function to fetch budgets
def get_all_budgets(cursor):
    cursor.execute("""
        SELECT budget_id, category_id, period_start, budget_amount, alert_threshold, budget_name
        FROM budgets
    """)
    return cursor.fetchall()

# Function to fetch net worth daily
def get_all_networth_daily(cursor):
    cursor.execute("""
        SELECT snapshot_date, net_worth
        FROM networth_daily
    """)
    return cursor.fetchall()

# Main route
@app.route('/')
def index():
    # Get the database connection
    connection = get_db_connection()
    cursor = connection.cursor()

    # Fetch data by calling the functions with the cursor
    allTransactions = get_all_transactions(cursor)
    allRecurringTransactions = get_all_recurring_transactions(cursor)
    allHoldings = get_all_holdings(cursor)
    holdingPrices = get_all_holding_prices(cursor)
    budgets = get_all_budgets(cursor)
    networthDaily = get_all_networth_daily(cursor)

    # Close the cursor and connection after all queries
    cursor.close()
    connection.close()

    # Render the results in a template
    return render_template('index.html', 
                           allTransactions=allTransactions, 
                           allRecurringTransactions=allRecurringTransactions,
                           allHoldings=allHoldings,
                           holdingPrices=holdingPrices,
                           budgets=budgets,
                           networthDaily=networthDaily)

if __name__ == '__main__':
    app.run(debug=True)
