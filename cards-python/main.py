from flask import Flask
import routes

app = Flask(__name__)
routes.register(app)

if __name__ == '__main__':
    """Run the Flask app"""
    app.run(host='0.0.0.0', port=5000, debug=True)
