import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true , type: 'text', default: null})
  hashedRefreshToken?: string | null;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
