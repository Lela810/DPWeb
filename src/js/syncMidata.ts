import http from 'node:http';

export function downloadMidataRecipients() {
	http
		.get('https://db.scout.ch/groups/6513/people.json', (res) => {
			res.headers['X-TOKEN'] = process.env.MIDATA_API_TOKEN;
			res.setEncoding('utf8');
			let rawData = '';
			res.on('data', (chunk) => {
				rawData += chunk;
			});
			res.on('end', () => {
				const parsedData = JSON.parse(rawData);
				console.log(parsedData);
			});
		})
		.on('error', (e) => {
			console.error(`Got error: ${e.message}`);
		});
}
