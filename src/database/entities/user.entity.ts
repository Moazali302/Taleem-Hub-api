import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { School } from './school.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  // @Column({ type: 'varchar', length: 255 })
  // school_id!: string;

  // @ManyToOne(() => School)
  // @JoinColumn({ name: 'school_id' })
  // school!: School;

 @ManyToOne(() => School, { nullable: true })
 @JoinColumn({ name: 'school_id' })
 school!: School | null;
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone!: string;

  @Column({
    type: 'enum',
    enum: ['superadmin', 'admin', 'teacher', 'student'],
    default: 'admin',
  })
  role!: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password_hash!: string;

  @Column({ name: 'isEmailVerified', type: 'boolean', default: false })
  email_verified!: boolean;

 @Column({ type: 'varchar', length: 6, nullable: true })
otp!: string | null;

@Column({ name: 'otpExpiry', type: 'timestamp', nullable: true })
otp_expires_at!: Date | null;

  @Column({
    name: 'refreshToken',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  refresh_token!: string | null;

  @Column({
    name: 'resetPasswordToken',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  reset_password_token!: string | null;

  @Column({
    name: 'resetPasswordTokenExpiry',
    type: 'timestamp',
    nullable: true,
  })
  reset_password_token_expiry!: Date | null;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  is_active!: boolean;

  @DeleteDateColumn()
  deleted_at!: Date;

  @CreateDateColumn({ name: 'createdAt' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updated_at!: Date;
}
