import { Migration } from '@mikro-orm/migrations';

export class Migration20240805082923 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "contact_us" ("id" text not null, "name" text not null, "email" text not null, "message" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "contact_us_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "contact_us" cascade;');
  }

}
