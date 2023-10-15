from flask import Flask, jsonify, request
from scryfall_bulk import get_card_data

app = Flask(__name__)


@app.route('/cards', methods=['POST'])
def fetch_card_data():
    data = request.get_json()
    url = data.get('url', None)
    if url:
        card_data = get_card_data(url)
        return jsonify({"status": "success", "data": card_data}), 200
    else:
        return jsonify({"status": "failure", "message": "No URL provided."}), 400


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
