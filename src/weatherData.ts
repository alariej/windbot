import axios from 'axios';
import config from './config.json';

interface WeatherData {
	wind: { deg: number; speed: number; gust: number };
	main: { temp: number; humidity: number; pressure: number };
	sys: { sunrise: number; sunset: number };
	weather: { description: string; main: string }[];
}

interface WeatherInfo {
	temperature: string;
	humidity: string;
	pressure: string;
	windSpeed: string;
	windDirection: string;
	windGust: string;
	sunrise: string;
	sunset: string;
	description: string;
}

export const getWeatherData = async (latitude: string, longitude: string): Promise<WeatherInfo | null> => {
	const response = await axios
		.get(
			'https://api.openweathermap.org/data/2.5/weather?lat=' +
				latitude +
				'&lon=' +
				longitude +
				'&appid=' +
				config.openweathermapKey +
				'&units=metric' +
				'&mode=json'
		)
		.catch(() => null);

	if (response?.status === 200) {
		const weatherData = response.data as WeatherData;

		const weatherInfo: WeatherInfo = {
			temperature: (Math.round(weatherData.main.temp * 10) / 10).toString(),
			humidity: Math.round(weatherData.main.humidity).toString(),
			pressure: Math.round(weatherData.main.pressure).toString(),
			windSpeed: (Math.round(weatherData.wind.speed * 3.6 * 10) / 10).toString(),
			windGust: (Math.round(weatherData.wind.gust * 3.6 * 10) / 10).toString(),
			windDirection: Math.round(weatherData.wind.deg).toString(),
			sunrise: new Date(weatherData.sys.sunrise * 1000)
				.toLocaleTimeString('de-CH', {
					timeZone: 'Europe/Zurich',
				})
				.substring(0, 5),
			sunset: new Date(weatherData.sys.sunset * 1000)
				.toLocaleTimeString('de-CH', {
					timeZone: 'Europe/Zurich',
				})
				.substring(0, 5),
			description: weatherData.weather[0].description,
		};

		return Promise.resolve(weatherInfo);
	} else {
		return Promise.resolve(null);
	}
};
