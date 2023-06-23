import { LoginParam_, MessageEventContent_ } from './MatrixApi';
import RestClient from './RestClient';
import sync, { PREFIX_REST } from './sync';
import { getWeatherData } from './weatherData';
import config from '../private/config.json';

export const userId = config.userId;
export const pwd = config.password;
export const server = config.server;
export const latitude = config.latitude;
export const longitude = config.longitude;

export const rooms: { [id: string]: string } = {};

const interval = 15;
const windSpeedLimit = 20;

let restClient!: RestClient;
let accessToken: string | undefined;

const login = async (userId: string, password: string, server: string) => {
	const restClient = new RestClient('', server, PREFIX_REST);

	const data: LoginParam_ = {
		identifier: {
			type: 'm.id.user',
			user: userId,
		},
		type: 'm.login.password',
		user: userId,
		password: password,
	};

	const response = await restClient.login(data).catch(() => null);

	accessToken = response?.access_token;
};

login(userId, pwd, server).then(() => {
	if (accessToken) {
		sync.start(accessToken, server);
		restClient = new RestClient(accessToken, server, PREFIX_REST);
	} else {
		console.log('NO ACCESS TOKEN');
	}
});

setInterval(() => {
	for (const id in rooms) {
		if (rooms[id] === 'START') {
			getWeatherData(latitude, longitude).then(response => {
				const windSpeed = Number(response?.windSpeed) || 0;
				if (windSpeed > windSpeedLimit) {
					const tempId = 'text' + Date.now();
					const body =
						'WIND NOTIFICATION\r\n' +
						'Speed: ' +
						response?.windSpeed +
						' km/h\r\n' +
						'Direction: ' +
						response?.windDirection +
						'°';

					const messageContent: MessageEventContent_ = {
						msgtype: 'm.text',
						body: body,
					};

					restClient.sendMessage(id, messageContent, tempId);
				}
			});
		}
	}
}, interval * 60 * 1000);
