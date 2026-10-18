import pytest
import app as app_module
import weather


@pytest.fixture
def client():
    app_module.app.config.update(TESTING=True)
    return app_module.app.test_client()


@pytest.fixture
def sample_data():
    return {
        "name": "Pune",
        "main": {
            "temp": 29,
            "feels_like": 31,
            "temp_min": 27,
            "temp_max": 32,
            "humidity": 65,
            "pressure": 1012
        },
        "wind": {"speed": 3.5},
        "weather": [
            {
                "main": "Clouds",
                "description": "scattered clouds",
                "icon": "03d"
            }
        ],
        "sys": {
            "country": "IN",
            "sunrise": 1720000000,
            "sunset": 1720040000
        },
        "timezone": 19800,
        "dt": 1720020000,
    }


class FakeResponse:
    def __init__(self, data, status_code=200):
        self.data = data
        self.status_code = status_code

    def json(self):
        return self.data


def test_homepage(client):
    assert client.get("/").status_code == 200


def test_empty_city(client):
    response = client.get("/weather")
    assert response.status_code == 400
    assert "error" in response.get_json()


def test_valid_city(client, monkeypatch, sample_data):
    monkeypatch.setenv("OPENWEATHER_API_KEY", "fake-key")
    monkeypatch.setattr(
        weather.requests,
        "get",
        lambda *a, **kw: FakeResponse(sample_data)
    )

    response = client.get("/weather?city=Pune")

    assert response.status_code == 200
    assert response.get_json()["city"] == "Pune"


def test_invalid_city(client, monkeypatch):
    monkeypatch.setenv("OPENWEATHER_API_KEY", "fake-key")
    monkeypatch.setattr(
        weather.requests,
        "get",
        lambda *a, **kw: FakeResponse({}, 404)
    )

    assert client.get("/weather?city=notreal").status_code == 404


def test_temperature_processing(client, monkeypatch, sample_data):
    monkeypatch.setenv("OPENWEATHER_API_KEY", "fake-key")
    monkeypatch.setattr(
        weather.requests,
        "get",
        lambda *a, **kw: FakeResponse(sample_data)
    )

    assert client.get("/weather?city=Pune").get_json()["feels_like"] == 31


def test_weather_advice():
    assert "umbrella" in weather.weather_advice(25, "Rain").lower()
    assert "hydrated" in weather.weather_advice(38, "Clear").lower()


def test_missing_api_key(client, monkeypatch):
    monkeypatch.delenv("OPENWEATHER_API_KEY", raising=False)

    assert client.get("/weather?city=Pune").status_code == 503


def test_api_network_failure(client, monkeypatch):
    monkeypatch.setenv("OPENWEATHER_API_KEY", "fake-key")

    def fail(*a, **kw):
        raise weather.requests.ConnectionError("offline")

    monkeypatch.setattr(weather.requests, "get", fail)

    assert client.get("/weather?city=Pune").status_code == 502

def test_thunderstorm_advice():
    assert "indoors" in weather.weather_advice(27, "Thunderstorm")


def test_hot_weather_advice():
    assert "hydrated" in weather.weather_advice(38, "Clear")


def test_cold_weather_advice():
    assert "warm" in weather.weather_advice(9, "Clouds")


def test_long_city(client):
    response = client.get("/weather?city=" + "a" * 101)
    assert response.status_code == 400