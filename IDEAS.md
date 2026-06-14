# Ideas backlog

Rough concepts worth building someday. Anything moved to a real file gets crossed off here.

## Weather & sky

- [ ] **Tide clock** — tide height as an animated wave for any coastal location (NOAA / Open-Meteo marine API)
- [ ] **Sun tracker** — arc showing sunrise / golden hour / sunset for your location, live dot moving along it
- [ ] **Moon phase** — canvas-drawn moon showing tonight's phase, illumination %, rise/set times
- [ ] **Starfield for tonight** — given your location + time, show which constellations are above the horizon (pure trig, no API)
- [ ] **ISS overhead** — live dot on a map + countdown to next pass over your location (Open Notify API, free)
- [ ] **Earthquake feed** — USGS live feed shown as a globe with pulsing dots for quakes in the last 24h

## Tools / utility

- [ ] **Just Tell Me** — one input, one answer. Type "BBQ tonight?" or "morning run?" and get a verdict + best window. No charts.
- [ ] **Breath pacer** — animated expanding circle for box breathing / Wim Hof. No API, pure CSS + Web Audio.
- [ ] **Pomodoro with ambient sound** — minimal timer that generates rain / noise via Web Audio API (no audio files needed)

## Notes

- Keep everything single-file, no build step, no npm
- Free APIs only — see README for the ones already in use
- Dark UI, mobile-first
