import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { School } from './school.entity';

@Entity('notification_logs')
export class NotificationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  school_id: string;

  @ManyToOne(() => School)
  @JoinColumn({ name: 'school_id' })
  school: School;

  @Column({ type: 'varchar', length: 100 })
  event: string;

  @Column({ type: 'uuid' })
  recipient_id: string;

  @Column({
    type: 'enum',
    enum: ['email', 'sms', 'push', 'in_app'],
  })
  channel: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'sent', 'failed', 'delivered'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'int', default: 0 })
  retry_count: number;

  @CreateDateColumn()
  timestamp: Date;
}
