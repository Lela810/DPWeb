import https from 'node:https';
import { MiData, MiDataPerson } from '../types/MiData';
import { recipientEntry } from '../types/prismaEntry';

export async function filterPeopleWithoutRoles(
	MiDataData: MiData
): Promise<MiDataPerson[]> {
	const peopleWithoutRoles: MiDataPerson[] = MiDataData.people.filter(
		(person) => {
			return !(person.links && person.links.roles);
		}
	);

	return peopleWithoutRoles;
}

export function downloadMidataRecipients(): Promise<MiData> {
	return new Promise((resolve, reject) => {
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
					try {
						const parsedData: MiData = JSON.parse(rawData);
						resolve(parsedData);
					} catch (error) {
						reject(error);
					}
				});
			})
			.on('error', (e) => {
				reject(e);
			});
	});
}
