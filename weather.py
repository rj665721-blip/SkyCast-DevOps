import os
from datetime import datetime, timezone, timedelta

import requests
from dotenv import load_dotenv

load_dotenv()

API_URL = "https://api.openweathermap.org/data/2.5/weather"


class WeatherError(Exception):
    def __init__(self, message, status_code=502):
        super().__init__(message)
        self.status_code = status_code


def weather_advice(temp, condition):
    condition = condition.lower()

    if "thunderstorm" in condition:
        return "Stay indoors during thunderstorms."

    if "rain" in condition or "drizzle" in condition:
        return "Carry an umbrella."

    if temp >= 35:
        return "Stay hydrated and avoid strong sunlight."

    if temp <= 15:
        return "Wear warm clothes."

    return "Enjoy your day!"


def get_weather(city):
    key = os.getenv("OPENWEATHER_API_KEY")

    if not key:
        raise WeatherError("Weather API key is not configured.", 503)

    try:
        response = requests.get(
            API_URL,
            params={"q": city, "appid": key, "units": "metric"},
            timeout=10
        )
    except requests.RequestException:
        raise WeatherError(
            "Weather service is unavailable. Please try again.", 502
        )

    if response.status_code == 404:
        raise WeatherError("City not found. Check the spelling.", 404)

    if response.status_code != 200:
        raise WeatherError("Weather service returned an error.", 502)

    try:
        data = response.json()

        main = data["main"]
        wind = data["wind"]
        condition = data["weather"][0]

        offset = timezone(
            timedelta(seconds=int(data.get("timezone", 0)))
        )

        def local_time(timestamp):
            return datetime.fromtimestamp(
                timestamp, tz=offset
            ).strftime("%I:%M %p")

        temp = main["temp"]
        description = condition["description"]

        return {
            "city": data["name"],
            "country": data.get("sys", {}).get("country", ""),
            "temperature": temp,
            "feels_like": main["feels_like"],
            "temp_min": main["temp_min"],
            "temp_max": main["temp_max"],
            "humidity": main["humidity"],
            "pressure": main["pressure"],
            "wind_speed": wind["speed"],
            "condition": description,
            "icon": condition["icon"],
            "sunrise": local_time(data["sys"]["sunrise"]),
            "sunset": local_time(data["sys"]["sunset"]),
            "updated": local_time(data["dt"]),
            "advice": weather_advice(temp, condition["main"]),
        }

    except (KeyError, IndexError, TypeError, ValueError, OverflowError):
        raise WeatherError("Invalid weather data received.", 502)