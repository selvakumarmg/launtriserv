import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({ default: 'pending' })
  account_status: string;

  @Column({ default: 'incomplete' })
  profile_status: string;

  @Column({ nullable: true, type: 'varchar', length: '6', name: 'otp' })
  otp: string | null;

  @Column({ type: 'datetime', nullable: true, name: 'otp_expires_at' })
  otp_expires_at: Date | null;

  @Column({ default: false, name: 'is_otp_verified' })
  is_otp_verified: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number | null;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}