import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Sprint {
  @PrimaryGeneratedColumn('uuid')
  uid!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'int' })
  gameStartTime!: number;

  @Column({ type: 'int' })
  gameEndTime!: number;

  @Column({ type: 'int' })
  gameDuration!: number;

  @Column({ type: 'int' })
  bubblesShot!: number;

  @Column({ type: 'float' })
  bubblesPerSecond!: number;

  @Column({ type: 'int' })
  bubblesClearToWin!: number;

  @Column({ type: 'int' })
  bubblesCleared!: number;

  @CreateDateColumn()
  createdAt!: Date;
}

