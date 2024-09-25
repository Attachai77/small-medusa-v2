import { Migration } from '@mikro-orm/migrations';

export class Migration20240816094701 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "admin-logs" ("id" text not null, "action" text not null, "actor_id" text not null, "resource_id" text null, "resource_type" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "admin-logs_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "admin-logs" cascade;');
  }

}
