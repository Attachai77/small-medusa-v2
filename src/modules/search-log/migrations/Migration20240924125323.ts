import { Migration } from '@mikro-orm/migrations';

export class Migration20240924125323 extends Migration {

  async up(): Promise<void> {
    this.addSql(`ALTER TABLE "top_search" ADD COLUMN "uri" VARCHAR NULL`);
  }

  async down(): Promise<void> {
    this.addSql('ALTER TABLE "top_search" DROP COLUMN "uri"');
  }

}
