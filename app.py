from flask import Flask, jsonify, render_template, request
from weather import WeatherError, get_weather

app = Flask(__name__)


@app.get("/")
def home():
    return render_template("index.html")


@app.get("/weather")
def weather_route():
    city = request.args.get("city", "").strip()

    if not city:
        return jsonify({"error": "Please enter a city name."}), 400

    if len(city) > 100:
         return jsonify({"error": "City name is too long."}), 400

    try:
        return jsonify(get_weather(city))

    except WeatherError as exc:
        return jsonify({"error": str(exc)}), exc.status_code


if __name__ == "__main__":
    app.run(debug=True)
