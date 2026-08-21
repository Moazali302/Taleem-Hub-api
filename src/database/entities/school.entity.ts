import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  SchoolStatusEnum,
  type SchoolStatusValue,
} from '../../common/constants/auth.constants';

@Entity('schools')
export class School {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'school_name', type: 'varchar', length: 255 })
  school_name: string;

  @Column({ name: 'school_address', type: 'varchar', length: 500 })
  school_address: string;

  @Column({ name: 'school_id', type: 'varchar', length: 255, unique: true })
  school_id: string;

  @Column({
    type: 'enum',
    enum: [
      SchoolStatusEnum.PENDING,
      SchoolStatusEnum.APPROVED,
      SchoolStatusEnum.REJECTED,
    ],
    default: SchoolStatusEnum.APPROVED,
  })
  status: SchoolStatusValue;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}