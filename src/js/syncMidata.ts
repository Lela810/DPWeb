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

async function fetchPersonDetails(url: string): Promise<any> {
	return new Promise((resolve, reject) => {
		https
			.get(url, (res) => {
				res.setEncoding('utf8');
				let rawData = '';
				res.on('data', (chunk) => {
					rawData += chunk;
				});
				res.on('end', () => {
					try {
						const parsedPerson = JSON.parse(rawData);
						resolve(parsedPerson);
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

export async function downloadMidataRecipients(): Promise<MiData> {
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
				res.on('end', async () => {
					try {
						let parsedData: MiData = JSON.parse(rawData);
						const peopleWithMissingEmails = parsedData.people.filter(
							(person) => !person.email
						);

						if (peopleWithMissingEmails.length > 0) {
							await peopleWithMissingEmails.map(async (person) => {
								const personDetails = await fetchPersonDetails(person.href);
								console.log(personDetails);
								person.email = personDetails.linked.additional_emails[0].email;
							});
						}
						console.log(peopleWithMissingEmails);
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
