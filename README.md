# windBot

A minimal node.js bot for a Matrix homeserver, which provides wind and weather information, and automatically sends a message to the room (or rooms) if a given wind speed has been exceeded.

## Installation

-   register bot user on Matrix homeserver, noting credentials
-   invite Matrix user or users to a room
-   rename or copy `config.template.json` to `config.json`
-   edit configuration values in `config.json`
-   `npm i`
-   `npm run build`
-   `node dist/windbot.js`

The bot will react to the following keywords (case insensitive):

-   WIND
-   TEMP
-   WEATHER
-   START
-   STOP

## Notes

-   Currently, the wind speed limit is hardcoded at 20 km/h and the interval for checking the wind speed is 15 minutes
-   The weather data is obtained from [openweathermap.org](https://openweathermap.org), which requires an API key to fetch the data
