import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'artists', synchronize: false })
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
