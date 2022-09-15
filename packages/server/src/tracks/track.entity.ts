import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tracks', synchronize: false })
export class Track {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column()
  title: string;

  @Column()
  track: number;

  @Column()
  start: number;

  @Column()
  duration: number;
}
