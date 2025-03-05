import {
	detailprogramme,
	invites,
	mails,
	recipients,
	activities,
} from '@prisma/client';
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type detailprogrammEntry = PartialBy<detailprogramme, 'id'>;
export type mailEntry = PartialBy<PartialBy<mails, 'id'>, 'date'>;
export type inviteEntry = PartialBy<invites, 'id'>;
export type recipientEntry = PartialBy<recipients, 'id'>;
export type activitiesEntry = PartialBy<activities, 'id'>;
