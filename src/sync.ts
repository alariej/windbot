import RestClient from './RestClient';
import { EventsFilter_, RoomFilter_, SyncFilter_ } from './MatrixApi';
import { handleMessage } from './handleMessage';
import { rooms } from './windbot';

export const PREFIX_REST = '/_matrix/client/v3/';

const syncTimeout = 60000;
const MESSAGE_COUNT_INC = 10;

const accountFilterRoom: EventsFilter_ = {
	limit: 0,
	types: [],
};

const roomFilter: RoomFilter_ = {
	timeline: {
		limit: MESSAGE_COUNT_INC,
		lazy_load_members: true,
		types: ['m.room.message'],
	},
	state: {
		lazy_load_members: true,
		types: [],
	},
	ephemeral: {
		lazy_load_members: true,
		types: [],
	},
	include_leave: true,
	account_data: accountFilterRoom,
};

const accountFilter: EventsFilter_ = {
	types: ['m.direct'],
};

const filter: SyncFilter_ = {
	room: roomFilter,
	account_data: accountFilter,
	presence: { types: ['m.presence'] },
};

let i = 0;

class Sync {
	private restClient!: RestClient;
	private nextSyncToken = '';

	public start = (accessToken: string, server: string) => {
		this.restClient = new RestClient(accessToken, server, PREFIX_REST);
		this.incrementalSync('', syncTimeout);
	};

	private incrementalSync = (syncToken: string, timeout: number) => {
		i = i + 1;

		this.restClient
			.getSyncFiltered(syncToken, filter, timeout, false)
			.then(syncData => {
				if (!syncToken || syncToken === this.nextSyncToken) {
					if (syncToken) {
						handleMessage(syncData, this.restClient);
					} else {
						for (const roomId in syncData.rooms?.join) {
							rooms[roomId] = '';
						}
					}

					this.nextSyncToken = syncData.next_batch!;

					this.incrementalSync(syncData.next_batch!, syncTimeout);
				}
			})
			.catch(() => {
				setTimeout(() => {
					this.incrementalSync(syncToken, syncTimeout);
				}, 15 * 1000);
			});
	};
}

export default new Sync();
