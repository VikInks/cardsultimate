from flask import Flask
import routes
import data_fetcher

app = Flask(__name__)
routes.register(app)

if __name__ == '__main__':
    """Run the Flask app"""
    print('Running Flask app')
    data_fetcher.initial_fetch()
    app.run(host='0.0.0.0', port=5000, debug=True)
