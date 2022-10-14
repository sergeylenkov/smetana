import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'genres', synchronize: false })
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
