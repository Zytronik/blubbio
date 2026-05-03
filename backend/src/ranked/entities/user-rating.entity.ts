import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class UserRating {
  @PrimaryGeneratedColumn('uuid')
  uid!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User;

  @Column({ type: 'float', default: 1500 })
  rating!: number;

  @Column({ type: 'float', default: 350 })
  ratingDeviation!: number;

  @Column({ type: 'float', default: 0.06 })
  volatility!: number;
}
