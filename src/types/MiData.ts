// types/MiData.ts

export interface MiDataPerson {
	id: string;
	type: 'people';
	href: string;
	first_name: string;
	last_name: string;
	nickname: string | null;
	company_name: string | null;
	company: boolean;
	email: string | null;
	address: string | null;
	zip_code: string | null;
	town: string | null;
	country: string | null;
	picture: string;
	links?: {
		additional_emails?: string[];
		phone_numbers?: string[];
		roles?: string[];
	};
}

export interface AdditionalEmail {
	id: string;
	email: string;
	label: string;
	public: boolean;
	mailings: boolean;
}

export interface PhoneNumber {
	id: string;
	number: string;
	label: string;
	public: boolean;
}

export interface Role {
	id: string;
	role_type: string;
	role_class: string;
	label: string;
	created_at: string;
	updated_at: string;
	start_on: string;
	end_on: string | null;
	links: {
		group: string;
		layer_group: string;
	};
}

export interface Group {
	id: string;
	name: string;
	group_type: string;
}

export interface MiData {
	people: MiDataPerson[];
	linked: {
		additional_emails: AdditionalEmail[];
		phone_numbers: PhoneNumber[];
		roles: Role[];
		groups: Group[];
	};
	links: {
		'roles.group': {
			href: string;
			type: 'groups';
		};
		'roles.layer_group': {
			href: string;
			type: 'groups';
		};
	};
}
