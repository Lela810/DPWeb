import {
	invites,
	mails,
	recipients,
	Activity,
	Departmant,
	Program,
	Flyer
} from '@prisma/client';
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type mailEntry = PartialBy<PartialBy<mails, 'id'>, 'date'>;
export type inviteEntry = PartialBy<PartialBy<invites, 'id'>, 'created'>;
export type recipientEntry = PartialBy<recipients, 'id'>;
export type departmantEntry = Departmant;
export type activityEntry = PartialBy<Activity, 'id'>;
export type programEntry = PartialBy<Program, 'id'>;
export type flyerEntry = PartialBy<Flyer, 'id'>;