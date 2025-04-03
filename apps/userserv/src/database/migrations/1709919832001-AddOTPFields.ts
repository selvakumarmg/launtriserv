import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOTPFields1709919832001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // First check if columns exist
        const hasOtpColumn = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'otp'
        `);

        const hasOtpExpiresAtColumn = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'otp_expires_at'
        `);

        const hasIsOtpVerifiedColumn = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'is_otp_verified'
        `);

        // Add columns if they don't exist
        if (!hasOtpColumn.length) {
            await queryRunner.query(`
                ALTER TABLE users 
                ADD COLUMN otp VARCHAR(6) NULL
            `);
        }

        if (!hasOtpExpiresAtColumn.length) {
            await queryRunner.query(`
                ALTER TABLE users 
                ADD COLUMN otp_expires_at TIMESTAMP NULL
            `);
        }

        if (!hasIsOtpVerifiedColumn.length) {
            await queryRunner.query(`
                ALTER TABLE users 
                ADD COLUMN is_otp_verified BOOLEAN DEFAULT FALSE
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Check if columns exist before dropping
        const hasOtpColumn = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'otp'
        `);

        const hasOtpExpiresAtColumn = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'otp_expires_at'
        `);

        const hasIsOtpVerifiedColumn = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'is_otp_verified'
        `);

        // Drop columns if they exist
        if (hasOtpColumn.length) {
            await queryRunner.query(`
                ALTER TABLE users 
                DROP COLUMN otp
            `);
        }

        if (hasOtpExpiresAtColumn.length) {
            await queryRunner.query(`
                ALTER TABLE users 
                DROP COLUMN otp_expires_at
            `);
        }

        if (hasIsOtpVerifiedColumn.length) {
            await queryRunner.query(`
                ALTER TABLE users 
                DROP COLUMN is_otp_verified
            `);
        }
    }
} 