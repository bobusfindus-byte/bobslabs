# bobslabs 🧪

Personal lab for single-file web experiments. Each project is a self-contained HTML file — no build step, no dependencies, open in a browser and go.

## Projects

| File | What it is |
|------|------------|
| [darksky_4.html](darksky_4.html) | Dark, minimal weather app — hourly timeline, 7-day strip, hyperlocal precip alerts, Disco mode |
| [supconditions.html](supconditions.html) | Stand Up Paddle conditions — wind, swell, animated tide chart, and a go/no-go verdict |
| [pubfinder.html](pubfinder.html) | Good pubs near you — sonar radar + scored cards, dives filtered out |

## Stack

All apps use free, no-key APIs:
- **Weather:** [Open-Meteo](https://open-meteo.com)
- **Marine / waves:** [Open-Meteo Marine API](https://open-meteo.com/en/docs/marine-weather-api)
- **Tides:** [NOAA CO-OPS](https://api.tidesandcurrents.noaa.gov/api/prod/) (US coastal stations, free, no key) · [Admiralty UKHO](https://admiraltyapi.developer.azure-api.net/) (UK & international, free key, routed through your own Cloudflare Worker proxy — see `workers/admiralty-proxy.js`)
- **Geocoding:** [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api)
- **Reverse geocoding:** [Nominatim / OpenStreetMap](https://nominatim.org)
