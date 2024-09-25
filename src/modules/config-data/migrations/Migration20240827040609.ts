import { Migration } from '@mikro-orm/migrations';

export class Migration20240827040609 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "config_data" ("id" text not null, "path" text not null, "value" text not null, "created_by" text not null, "updated_by" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "config_data_pkey" primary key ("id"));');

    this.addSql('ALTER TABLE "order" DROP COLUMN "display_id";');
    this.addSql(
      'ALTER TABLE "order" ADD COLUMN "display_id" TEXT DEFAULT NULL;'
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "config_data" cascade;');

    this.addSql('ALTER TABLE "order" DROP COLUMN "display_id";');
    this.addSql('ALTER TABLE "order" ADD COLUMN "display_id" SERIAL;');
  }

}
