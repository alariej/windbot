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
			temperature: weatherData.main.temp.toFixed(1),
			humidity: weatherData.main.humidity.toFixed(0),
			pressure: weatherData.main.pressure.toFixed(0),
			windSpeed: (weatherData.wind.speed * 3.6).toFixed(1),
			windGust: typeof weatherData.wind.gust === 'number' ? (weatherData.wind.gust * 3.6).toFixed(1) : '',
			windDirection: weatherData.wind.deg.toFixed(0),
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
