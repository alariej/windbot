import axios from 'axios';
import { LoginParam_, LoginResponse_, MessageEventContent_, SyncFilter_, SyncResponse_ } from './MatrixApi';

export default class RestClient {
	constructor(accessToken: string, homeServer: string, prefix: string) {
		axios.defaults.baseURL = 'https://' + homeServer + prefix;
		if (accessToken) {
			axios.defaults.headers.common = { Authorization: 'Bearer ' + accessToken };
		}
	}

	private async post(url: string, data: any): Promise<any> {
		const response = await axios.post(url, data).catch(error => {
			return Promise.reject(error);
		});
		return Promise.resolve(response.data);
	}

	private async put(url: string, data: any): Promise<any> {
		const response = await axios.put(url, data).catch(error => {
			return Promise.reject(error);
		});
		return Promise.resolve(response.data);
	}

	private async get(url: string): Promise<any> {
		const response = await axios.get(url).catch(error => {
			return Promise.reject(error);
		});
		return Promise.resolve(response.data);
	}

	public login(data: LoginParam_): Promise<LoginResponse_> {
		return this.post('login', data);
	}

	public getSyncFiltered(
		syncToken: string,
		filter: SyncFilter_,
		syncTimeout: number,
		fullState: boolean
	): Promise<SyncResponse_> {
		const filter_ = JSON.stringify(filter);

		return this.get(
			'sync?timeout=' +
				syncTimeout +
				'&filter=' +
				filter_ +
				'&full_state=' +
				fullState +
				'&set_presence=online' +
				(syncToken ? '&since=' + encodeURI(syncToken) : '')
		);
	}

	public sendMessage(roomId: string, messageContent: MessageEventContent_, tempId: string): Promise<void> {
		return this.put('rooms/' + roomId + '/send/m.room.message/' + tempId, messageContent);
	}

	public sendReadReceipt(roomId: string, eventId: string): Promise<void> {
		const content = {
			'm.fully_read': eventId,
			'm.read': eventId,
		};

		return this.post('rooms/' + roomId + '/read_markers', content);
	}
}
