import axios from 'axios';

interface WeatherData {
	current_weather: {
		temperature: string;
		windspeed: string;
		winddirection: string;
	};
}

interface WeatherInfo {
	temperature: string;
	windSpeed: string;
	windDirection: string;
}

export const getWeatherData = async (latitude: string, longitude: string): Promise<WeatherInfo | null> => {
	const response = await axios
		.get(
			'https://api.open-meteo.com/v1/forecast?latitude=' +
				latitude +
				'&longitude=' +
				longitude +
				'&current_weather=true&forecast_days=1'
		)
		.catch(() => null);

	if (response?.status === 200) {
		const weatherData = response.data as WeatherData;

		const weatherInfo: WeatherInfo = {
			temperature: weatherData.current_weather.temperature,
			windSpeed: weatherData.current_weather.windspeed,
			windDirection: weatherData.current_weather.winddirection,
		};

		return Promise.resolve(weatherInfo);
	} else {
		return Promise.resolve(null);
	}
};
