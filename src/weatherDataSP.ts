// https://www.tecson-data.ch/zurich/tiefenbrunnen/minianz/startseite.php?position=Tiefenbrunnen

import axios from 'axios';

export const getWeatherDataSP = async (): Promise<string> => {
	const response = await axios
		.get('https://www.tecson-data.ch/zurich/tiefenbrunnen/minianz/startseite.php?position=Tiefenbrunnen')
		.catch(error => {
			return error;
		});

	// return JSON.stringify(response?.data || response?.error);

	const table: Array<string> = [];
	const cellRegex = /(?<=\<td width="15%" align="right" class="zeile"\>).*?(?=\<\/td\>)/g;
	response.data.matchAll(cellRegex).forEach((cell: string) => {
		table.push(cell.replace('&nbsp;', ''));
	});
	console.log(table)
	return (
		table[0] +
		'/n' +
		table[1] +
		'/n' +
		table[2] +
		'/n' +
		table[3] +
		'/n' +
		table[4] +
		'/n' +
		table[5] +
		'/n' +
		table[6] +
		'/n' +
		table[7] +
		'/n' +
		table[8]
	);
};
