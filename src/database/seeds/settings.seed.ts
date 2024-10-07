import { QueryBuilder } from "typeorm";

import { SettingsEntity } from "../../modules/settings/settings.entity";

type ISettingsEntity = Omit<
	SettingsEntity,
	"id" | "ext_id" | "created_at" | "updated_at" | "is_active"
>;

export async function up(query: QueryBuilder<object>) {
	const settings: ISettingsEntity = {
		booking_limit: 0,
		training_show_date_limit: 0,
	};
	await query.insert().into(SettingsEntity).values(settings).execute();
}

export async function down(query: QueryBuilder<object>) {
	await query.delete().from(SettingsEntity).execute();
}
