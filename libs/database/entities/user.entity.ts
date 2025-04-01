import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  CUSTOMER = 'customer',
  SERVICE_PROVIDER = 'service_provider',
  DELIVERY_PARTNER = 'delivery_partner',
  ADMIN = 'admin',
  CUSTOMER_SUPPORT = 'customer_support',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  pincode: number;

  @Column({ nullable: true })
  account_status: string;

  @Column({ nullable: true })
  profile_status: string;

  @Column('json', { nullable: true })
  preferences: any;

  @Column({ nullable: true })
  referral_code: string;

  @Column({ nullable: true })
  invited_by: string;

  @Column({ nullable: true })
  otp: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 