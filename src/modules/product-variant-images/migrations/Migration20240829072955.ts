import { Migration } from '@mikro-orm/migrations';

export class Migration20240829072955 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "product_variant_images" ("id" text not null, "variant_id" text not null, "url" text not null, "metadata" jsonb null, "rank" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_variant_images_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "product_variant_images" cascade;');
  }

}
