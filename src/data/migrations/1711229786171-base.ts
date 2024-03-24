import { MigrationInterface, QueryRunner } from "typeorm";

export class Base1711229786171 implements MigrationInterface {
  name = "Base1711229786171";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`rate_limit\` (\`id\` int NOT NULL AUTO_INCREMENT, \`windowSeconds\` int NOT NULL, \`requestsAllowed\` int NOT NULL, \`routeRegex\` varchar(255) NOT NULL, \`ruleExpiry\` timestamp NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`rate_limit\``);
  }
}
