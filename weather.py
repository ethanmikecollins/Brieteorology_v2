import requests
import json

latitude = 40.69225
longitude = -73.91458

url = "https://api.open-meteo.com/v1/gfs"

params = {
    "latitude": latitude,
    "longitude": longitude,

    "hourly": [
        "temperature_2m",
        "relative_humidity_2m",
        "precipitation",
        "snowfall",
        "wind_speed_10m",
        "cloud_cover"
    ],

    "daily": [
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_sum",
        "snowfall_sum",
        "sunrise",
        "sunset",
        "moon_phase"
    ],

    "forecast_hours": 32,
    "timezone": "America/New_York",

    "temperature_unit": "fahrenheit",
    "wind_speed_unit": "mph",
    "precipitation_unit": "inch",

    "models": "ncep_hrrr_conus"
}

response = requests.get(url, params=params)
response.raise_for_status()

weather = response.json()
with open("weather.json", "w") as file:
    json.dump(weather, file)
