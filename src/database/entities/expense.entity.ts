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

/**
 * Manually entered platform expense (e.g. hosting, salaries, marketing).
 * Revenue is calculated automatically from Subscription plans; expenses are
 * entered manually by the Super Admin since there is no automated expense
 * source yet.
 */
@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Nullable: an expense can be platform-wide (e.g. server hosting) rather
  // than tied to a specific school.
  @Column({ type: 'int', nullable: true })
  school_id: number | null;

  @ManyToOne(() => School, { nullable: true })
  @JoinColumn({ name: 'school_id' })
  school: School | null;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  note: string | null;

  @Column({ type: 'date' })
  expense_date: Date;

  @Column({ type: 'int', nullable: true })
  created_by: number | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}