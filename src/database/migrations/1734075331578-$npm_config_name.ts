import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1734075331578 implements MigrationInterface {
    name = ' $npmConfigName1734075331578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_workspace\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NULL, \`workspaceId\` int NULL, \`roleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_workspace\` ADD CONSTRAINT \`FK_4ea12fabb12c08c3dc8839d0932\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_workspace\` ADD CONSTRAINT \`FK_46438fa9a476521c49324b59843\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspace\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_workspace\` ADD CONSTRAINT \`FK_effc3b866423783da8ba1785d04\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_board\` ADD CONSTRAINT \`FK_3c1ebe36479ec7348ebed9fc2db\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_board\` ADD CONSTRAINT \`FK_a08e6af137cd4049e8f2673623e\` FOREIGN KEY (\`boardId\`) REFERENCES \`board\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_board\` ADD CONSTRAINT \`FK_0451c98dc84a84b5a4f0a053eec\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_board\` DROP FOREIGN KEY \`FK_0451c98dc84a84b5a4f0a053eec\``);
        await queryRunner.query(`ALTER TABLE \`user_board\` DROP FOREIGN KEY \`FK_a08e6af137cd4049e8f2673623e\``);
        await queryRunner.query(`ALTER TABLE \`user_board\` DROP FOREIGN KEY \`FK_3c1ebe36479ec7348ebed9fc2db\``);
        await queryRunner.query(`ALTER TABLE \`user_workspace\` DROP FOREIGN KEY \`FK_effc3b866423783da8ba1785d04\``);
        await queryRunner.query(`ALTER TABLE \`user_workspace\` DROP FOREIGN KEY \`FK_46438fa9a476521c49324b59843\``);
        await queryRunner.query(`ALTER TABLE \`user_workspace\` DROP FOREIGN KEY \`FK_4ea12fabb12c08c3dc8839d0932\``);
        await queryRunner.query(`DROP TABLE \`user_workspace\``);
    }

}
