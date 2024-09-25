import { Migration } from '@mikro-orm/migrations';

export class Migration20240911115012 extends Migration {

  async up(): Promise<void> {
    // drop column display_id in order
    this.addSql('alter table if exists "order" drop column if exists "display_id";');

    // create new column display_id in order type serial auto increment nullable
    this.addSql('alter table if exists "order" add column "display_id" serial');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "order" drop column if exists "display_id";');

    this.addSql('alter table if exists "order" add column "display_id" text default null;');
  }

}
