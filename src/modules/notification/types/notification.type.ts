import { NotificationType } from "../notification.entity";

interface ObjectType {
	id: number;
	photo?: string;
}

export interface INotification {
	id: number;
	created_at: Date;
	updated_at: Date;
	title: string;
	description?: string;
	type: NotificationType;
	object_id: number;
	is_read: boolean;
	user_id?: number;
	photo?: string;
	is_active: boolean;
	object: ObjectType;
}
