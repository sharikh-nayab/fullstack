from flask import Flask

app = Flask(__name__)  # Create a Flask application instance

@app.route('/')  # Define a route for the root URL
def home():
    return "Hello, this is the backend speaking!"  # Response to send back

if __name__ == '__main__':
    app.run(debug=True)  # Start the app in debug mode
