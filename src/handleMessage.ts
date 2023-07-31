import { MessageEventContent_, SyncResponse_ } from './MatrixApi';
import RestClient from './RestClient';
import { getWeatherData } from './weatherData';
import { getWeatherDataSP } from './weatherDataSP';
import { latitude, longitude, rooms, server, userId } from './windbot';

// const commands = ['WIND', 'TEMP', 'WEATHER', 'START', 'STOP', 'UP', 'DOWN', 'HELP'];

export const handleMessage = async (syncData: SyncResponse_, restClient: RestClient) => {
	for (const roomId in syncData.rooms?.join) {
		const lastEvent = syncData.rooms.join[roomId].timeline.events[0];
		const selfId = '@' + userId + ':' + server;

		if (lastEvent.sender !== selfId) {
			restClient.sendReadReceipt(roomId, lastEvent.event_id);

			if (lastEvent.type === 'm.room.message') {
				const content = lastEvent.content as MessageEventContent_;
				const key = content.body?.toUpperCase().trim();

				let bodyReply = '';
				switch (key) {
					case 'WIND':
						bodyReply = await getWind().catch(() => '');
						break;

					case 'TEMP':
						bodyReply = await getTemperature().catch(() => '');
						break;

					case 'WEATHER':
						bodyReply = await getWeather().catch(() => '');
						break;

					case 'START':
						bodyReply = startNotifications(roomId);
						break;

					case 'STOP':
						bodyReply = stopNotifications(roomId);
						break;

					case 'TEST':
						bodyReply = await getWeatherDataSP().catch(() => '');
						break;

					default:
						bodyReply = 'Huuh?';
						break;
				}

				const tempId = 'text' + Date.now();
				const messageContent: MessageEventContent_ = {
					msgtype: 'm.text',
					body: bodyReply,
				};
				restClient.sendMessage(roomId, messageContent, tempId);
			}
		}
	}
};

const getWind = async (): Promise<string> => {
	const response = await getWeatherData(latitude, longitude).catch(() => null);
	return Promise.resolve(
		'Wind Speed: ' +
			(response?.windSpeed ? response?.windSpeed + ' km/h' : '-') +
			'\r\n' +
			'Wind Gusts: ' +
			(response?.windGust ? response?.windGust + ' km/h' : '-') +
			'\r\n' +
			'Wind Direction: ' +
			(response?.windDirection ? response?.windDirection + '°' : '-')
	);
};

const getTemperature = async (): Promise<string> => {
	const response = await getWeatherData(latitude, longitude).catch(() => null);
	return Promise.resolve('Temperature: ' + (response?.temperature ? response?.temperature + '°C' : '-'));
};

const getWeather = async (): Promise<string> => {
	const response = await getWeatherData(latitude, longitude).catch(() => null);
	return Promise.resolve(
		'Description: ' +
			(response?.description || '-') +
			'\r\n' +
			'Temperature: ' +
			(response?.temperature ? response?.temperature + '°C' : '-') +
			'\r\n' +
			'Humidity: ' +
			(response?.humidity ? response?.humidity + '%' : '-') +
			'\r\n' +
			'Pressure: ' +
			(response?.pressure ? response?.pressure + ' hPa' : '-') +
			'\r\n' +
			'Wind Speed: ' +
			(response?.windSpeed ? response?.windSpeed + ' km/h' : '-') +
			'\r\n' +
			'Wind Gusts: ' +
			(response?.windGust ? response?.windGust + ' km/h' : '-') +
			'\r\n' +
			'Wind Direction: ' +
			(response?.windDirection ? response?.windDirection + '°' : '-') +
			'\r\n' +
			'Sunrise: ' +
			(response?.sunrise || '-') +
			'\r\n' +
			'Sunset: ' +
			(response?.sunset || '-')
	);
};

const startNotifications = (roomId: string): string => {
	rooms[roomId] = 'START';
	return 'Notifications started';
};

const stopNotifications = (roomId: string): string => {
	rooms[roomId] = 'STOP';
	return 'Notifications stopped';
};
