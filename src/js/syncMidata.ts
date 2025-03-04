import https from 'node:https';
import { MiDataPerson } from '../types/MiDataPerson';

export function downloadMidataRecipients() {
	const options = {
		hostname: 'db.scout.ch',
		path: '/groups/6513/people.json',
		headers: {
			'X-TOKEN': process.env.MIDATA_API_TOKEN,
		},
	};

	https
		.get(options, (res) => {
			res.setEncoding('utf8');
			let rawData = '';
			res.on('data', (chunk) => {
				rawData += chunk;
			});
			res.on('end', () => {
				const parsedData: MiDataPerson = JSON.parse(rawData);
				return parsedData;
				//console.log(parsedData);
			});
		})
		.on('error', (e) => {
			console.error(`Got error: ${e.message}`);
		});
}
