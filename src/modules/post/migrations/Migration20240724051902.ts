import { Migration } from "@mikro-orm/migrations";

export class Migration20240724051902 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'create table if not exists "posts" ("id" text not null, "title" text not null, "short_content" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "posts_pkey" primary key ("id"));',
		);
	}

	async down(): Promise<void> {
		this.addSql('drop table if exists "posts" cascade;');
	}
}
