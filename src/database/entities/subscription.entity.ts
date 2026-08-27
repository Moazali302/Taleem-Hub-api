import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { School } from './school.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // School.id is an auto-increment integer (see school.entity.ts), so the FK
  // column here must be 'int', not 'uuid' — a uuid column cannot reference
  // an integer primary key.
  @Column({ type: 'int' })
  school_id: number;

  @ManyToOne(() => School)
  @JoinColumn({ name: 'school_id' })
  school: School;

  @Column({
    type: 'enum',
    enum: ['basic', 'advanced', 'premium'],
    default: 'basic',
  })
  plan: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({
    type: 'enum',
    enum: ['active', 'expired', 'cancelled', 'pending'],
    default: 'active',
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}