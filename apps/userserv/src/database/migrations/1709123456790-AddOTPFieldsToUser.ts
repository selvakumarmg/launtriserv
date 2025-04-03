import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOTPFieldsToUser1709123456790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'otp',
        type: 'varchar',
        length: '6',
        isNullable: true,
      }),
      new TableColumn({
        name: 'otp_expires_at',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'is_otp_verified',
        type: 'boolean',
        default: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'otp');
    await queryRunner.dropColumn('users', 'otp_expires_at');
    await queryRunner.dropColumn('users', 'is_otp_verified');
  }
} 