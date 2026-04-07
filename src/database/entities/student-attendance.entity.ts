import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { User } from './user.entity';

@Entity('student_attendance')
export class StudentAttendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  student_id: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'date' })
  date: Date;

  @Column({
    type: 'enum',
    enum: ['present', 'absent', 'late', 'excused'],
    default: 'absent',
  })
  status: string;

  @Column({ type: 'uuid' })
  marked_by: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'marked_by' })
  markedByUser: User;

  @Column({ type: 'boolean', default: false })
  locked: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
