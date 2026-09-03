from herbie import Herbie, FastHerbie
from herbie.latest import HerbieLatest
import xarray as xr
from datetime import datetime, timedelta, UTC
from zoneinfo import ZoneInfo
import pandas as pd

now = datetime.now(ZoneInfo("America/New_York"))
utc_now = now.astimezone(UTC)
date = utc_now.date()
time = utc_now.strftime("%H:%M")

latest = HerbieLatest(
    model="hrrr",
    product="sfc",
    fxx=24,
    periods = 12
)

location = pd.DataFrame({
    "longitude": [-73.91458],
    "latitude": [40.69225],
})

print("Using HRRR run:", latest.date)

FH = FastHerbie([latest.date], model="hrrr", product="sfc", fxx=range(0,25))

searches = {
    "TMP": r":TMP:2 m above ground:",                   # Temp (K)
    "RH": r":RH:2 m above ground:",                     # Rel humidity (%)
    "APCP": r":APCP:.*:(?:0-1|[1-9]\d*-\d+) hour"       # Accumulated precipitation (kg/m^2)
    "PRATE": r":PRATE:surface:",                        # Precipitation rate (kg/m^2/s)
    "SNOD": r":SNOD:surface:",                          # Snow depth (m)
    "UGRD": r":UGRD:10 m above ground:",                # x component of wind velocity (m/s)
    "VGRD": r":VGRD:10 m above ground:",                # y component of wind velocity (m/s)
    "TCDC": r":TCDC:entire atmosphere:"                 # Total cloud cover (%)
}


def extractVals(search):
    ds = FH.xarray(search)
    bushwick_data = ds.herbie.pick_points(location, method='nearest')

    variable_name = list(bushwick_data.data_vars)[0]

    vals = bushwick_data[variable_name].squeeze().values
    times = bushwick_data["valid_time"].squeeze().values

    times = pd.to_datetime(times, utc=True)
    times = times.tz_convert("America/New_York")

    times = [t.strftime("%I:%M %p").lstrip("0") for t in times]

    return vals, times


forecast_data = {}
forecast_times = None

for name, search in searches.items():
    vals, times = extractVals(search)

    forecast_data[name] = vals

    if forecast_times is None:
        forecast_times = times

print(forecast_data)
print(forecast_times)