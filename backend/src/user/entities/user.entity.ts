import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uid!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ nullable: true })
  countryCode?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  pbUrl?: string;

  @Column({ nullable: true })
  bannerUrl?: string;

  @Column({ type: 'timestamp', nullable: true })
  lastDisconnectedAt?: Date;

  @Column({ type: 'text', nullable: true })
  settings?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
