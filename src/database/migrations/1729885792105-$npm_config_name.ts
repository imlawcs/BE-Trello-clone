import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1729885792105 implements MigrationInterface {
    name = ' $npmConfigName1729885792105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`role_permission\` (\`permissionId\` int NOT NULL, \`roleId\` int NOT NULL, INDEX \`IDX_72e80be86cab0e93e67ed1a7a9\` (\`permissionId\`), INDEX \`IDX_e3130a39c1e4a740d044e68573\` (\`roleId\`), PRIMARY KEY (\`permissionId\`, \`roleId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_role\` (\`roleId\` int NOT NULL, \`userId\` int NOT NULL, INDEX \`IDX_dba55ed826ef26b5b22bd39409\` (\`roleId\`), INDEX \`IDX_ab40a6f0cd7d3ebfcce082131f\` (\`userId\`), PRIMARY KEY (\`roleId\`, \`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_workspace\` (\`userId\` int NOT NULL, \`workspaceId\` int NOT NULL, INDEX \`IDX_4ea12fabb12c08c3dc8839d093\` (\`userId\`), INDEX \`IDX_46438fa9a476521c49324b5984\` (\`workspaceId\`), PRIMARY KEY (\`userId\`, \`workspaceId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_card\` (\`cardId\` int NOT NULL, \`userId\` int NOT NULL, INDEX \`IDX_5a656191ed12e26ca37b12bdc2\` (\`cardId\`), INDEX \`IDX_63c57bfaa0ef02c317b0c77f42\` (\`userId\`), PRIMARY KEY (\`cardId\`, \`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`role_permission\` ADD CONSTRAINT \`FK_72e80be86cab0e93e67ed1a7a9a\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permission\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`role_permission\` ADD CONSTRAINT \`FK_e3130a39c1e4a740d044e685730\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_dba55ed826ef26b5b22bd39409b\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_ab40a6f0cd7d3ebfcce082131fd\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_workspace\` ADD CONSTRAINT \`FK_4ea12fabb12c08c3dc8839d0932\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_workspace\` ADD CONSTRAINT \`FK_46438fa9a476521c49324b59843\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspace\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_card\` ADD CONSTRAINT \`FK_5a656191ed12e26ca37b12bdc2f\` FOREIGN KEY (\`cardId\`) REFERENCES \`card\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_card\` ADD CONSTRAINT \`FK_63c57bfaa0ef02c317b0c77f42c\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_card\` DROP FOREIGN KEY \`FK_63c57bfaa0ef02c317b0c77f42c\``);
        await queryRunner.query(`ALTER TABLE \`user_card\` DROP FOREIGN KEY \`FK_5a656191ed12e26ca37b12bdc2f\``);
        await queryRunner.query(`ALTER TABLE \`user_workspace\` DROP FOREIGN KEY \`FK_46438fa9a476521c49324b59843\``);
        await queryRunner.query(`ALTER TABLE \`user_workspace\` DROP FOREIGN KEY \`FK_4ea12fabb12c08c3dc8839d0932\``);
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_ab40a6f0cd7d3ebfcce082131fd\``);
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_dba55ed826ef26b5b22bd39409b\``);
        await queryRunner.query(`ALTER TABLE \`role_permission\` DROP FOREIGN KEY \`FK_e3130a39c1e4a740d044e685730\``);
        await queryRunner.query(`ALTER TABLE \`role_permission\` DROP FOREIGN KEY \`FK_72e80be86cab0e93e67ed1a7a9a\``);
        await queryRunner.query(`DROP INDEX \`IDX_63c57bfaa0ef02c317b0c77f42\` ON \`user_card\``);
        await queryRunner.query(`DROP INDEX \`IDX_5a656191ed12e26ca37b12bdc2\` ON \`user_card\``);
        await queryRunner.query(`DROP TABLE \`user_card\``);
        await queryRunner.query(`DROP INDEX \`IDX_46438fa9a476521c49324b5984\` ON \`user_workspace\``);
        await queryRunner.query(`DROP INDEX \`IDX_4ea12fabb12c08c3dc8839d093\` ON \`user_workspace\``);
        await queryRunner.query(`DROP TABLE \`user_workspace\``);
        await queryRunner.query(`DROP INDEX \`IDX_ab40a6f0cd7d3ebfcce082131f\` ON \`user_role\``);
        await queryRunner.query(`DROP INDEX \`IDX_dba55ed826ef26b5b22bd39409\` ON \`user_role\``);
        await queryRunner.query(`DROP TABLE \`user_role\``);
        await queryRunner.query(`DROP INDEX \`IDX_e3130a39c1e4a740d044e68573\` ON \`role_permission\``);
        await queryRunner.query(`DROP INDEX \`IDX_72e80be86cab0e93e67ed1a7a9\` ON \`role_permission\``);
        await queryRunner.query(`DROP TABLE \`role_permission\``);
    }

}
