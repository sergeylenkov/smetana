import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'covers', synchronize: false })
export class Cover {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  file: string;

  @Column()
  main: boolean;
}
