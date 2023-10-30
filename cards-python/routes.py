from flask import jsonify
from data_fetcher import initial_fetch
import logging


def register(app):
    @app.route('/update_data', methods=['POST'])
    def update_data_route():
        try:
            initial_fetch()
            return jsonify({"status": "success"}), 200
        except Exception as e:
            logging.error(f"Error: {e}")
            return jsonify({"status": "failure", "message": str(e)}), 500
