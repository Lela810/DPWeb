import { recipients } from '@prisma/client';

export interface mailEntry {
	invite: boolean;
	sender: string;
	receivers: recipients[];
	subject: string;
	message: string;
	date: string;
}

export interface inviteEntry {
	mailId: string;
	identifiers: string[];
	mails: string[];
}

export interface recipientEntry {
	mail: string;
	name: string;
}

export interface detailprogrammEntry {
	ablauf: string[];
	date: string;
	endtime: string;
	location: string;
	material: string;
	responsible: string;
	starttime: string;
	zeit: string[];
}
