import { MessageEventContent_, SyncResponse_ } from './MatrixApi';
import RestClient from './RestClient';
import { getWeatherData } from './weatherData';
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
				const key = content.body?.toUpperCase();

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
			(response?.windSpeed || '99.9') +
			' km/h\r\n' +
			'Wind Direction: ' +
			(response?.windDirection || '99.9') +
			'°'
	);
};

const getTemperature = async (): Promise<string> => {
	const response = await getWeatherData(latitude, longitude).catch(() => null);
	return Promise.resolve('Temperature: ' + (response?.temperature || '99.9') + '°C');
};

const getWeather = async (): Promise<string> => {
	const response = await getWeatherData(latitude, longitude).catch(() => null);
	return Promise.resolve(
		'Temperature: ' +
			(response?.temperature || '99.9') +
			'°C\r\n' +
			'Wind Speed: ' +
			(response?.windSpeed || '99.9') +
			' km/h\r\n' +
			'Wind Direction: ' +
			(response?.windDirection || '99.9') +
			'°'
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
