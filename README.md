# windBot

A minimal bot for a Matrix homeserver, which provides the wind speed and direction, and the temperature, and automatically sends a message if a given wind speed has been exceeded.

## Installation

- register bot user on Matrix homeserver, noting credentials
- invite Matrix user or users to a room
- rename `/private/config.template.json` to `/private/config.json`
- edit configuration values in `/private/config.json`
- `npm i`
- `npm run build`
- `node dist/windbot.js`

The bot will react to the following keywords (case doesn't matter):

- WIND
- TEMP
- WEATHER
- START
- STOP

## Note

Currently, the wind speed limit is hardcoded at 15 km/h and the interval for checking the wind speed is 15 minutes.