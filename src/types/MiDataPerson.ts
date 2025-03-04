export interface MiDataPerson {
	id: string;
	type: 'people';
	href: string;
	first_name: string;
	last_name: string;
	nickname: string;
	company_name: string | null;
	company: boolean;
	email: string;
	address: string;
	zip_code: string;
	town: string;
	country: string | null;
	picture: string;
	links: {
		additional_emails: string[];
		phone_numbers: string[];
		roles: string[];
	};
}
