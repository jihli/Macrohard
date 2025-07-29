import mysql.connector

def get_db_connection():
    # Establish the connection
    connection = mysql.connector.connect(
        host="localhost",        # or '127.0.0.1'
        user="root",             # Your MySQL username
        password="n3u3da!",      # Your MySQL password
        database="wealth_app"   # The database you want to connect to
    )
    return connection
