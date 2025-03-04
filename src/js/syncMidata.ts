import https from 'node:https';
import { MiData, MiDataPerson } from '../types/MiData';

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

async function fetchPersonDetails(id: string): Promise<any> {
	return new Promise((resolve, reject) => {
		const options = {
			hostname: 'db.scout.ch',
			path: '/groups/6513/people/' + id + '.json',
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
							await Promise.all(
								peopleWithMissingEmails.map(async (person) => {
									const personDetails = await fetchPersonDetails(person.id);
									if (
										personDetails.linked &&
										personDetails.linked.additional_emails &&
										personDetails.linked.additional_emails.length > 0
									) {
										person.email =
											personDetails.linked.additional_emails[0].email;
										const index = parsedData.people.findIndex(
											(p) => p.id === person.id
										);
										if (index !== -1) {
											parsedData.people[index].email = person.email;
										}
									}
								})
							);
						}
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
