import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * A lead captured from the public marketing website's "Request a demo" form.
 * Not tied to a school_id since the submitter is not yet a registered tenant.
 */
@Entity('demo_requests')
export class DemoRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  full_name: string;

  @Column({ type: 'varchar', length: 255 })
  school_name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  message: string | null;

  @Column({
    type: 'enum',
    enum: ['new', 'contacted', 'converted', 'rejected'],
    default: 'new',
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}