import { User } from 'src/user/entities/user.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    UpdateDateColumn,
    Index,
    ManyToOne,
} from 'typeorm';

@Entity()
export class SprintPersonalBest {
    @PrimaryGeneratedColumn('uuid')
    uid!: string;

    @Column()
    userId!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Index()
    @Column()
    bestGameDuration!: number;

    @Column({ type: 'float' })
    bubblesPerSecond!: number;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ nullable: true })
    @Index()
    countryCode?: string;
}