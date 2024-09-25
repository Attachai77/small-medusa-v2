import { Migration } from '@mikro-orm/migrations';

export class Migration20240916092358 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "search_logs" ("id" text not null, "search" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "search_logs_pkey" primary key ("id"));');

    this.addSql('create table if not exists "top_search" ("id" text not null, "search" text not null, "count" integer not null default 0, "type" text check ("type" in (\'search-engine\', \'recommend\')) not null default \'search-engine\', "product_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "top_search_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "search_logs" cascade;');

    this.addSql('drop table if exists "top_search" cascade;');
  }

}
