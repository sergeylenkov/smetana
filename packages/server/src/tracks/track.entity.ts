import { Album } from '../albums/album.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

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

  @Column({ name: 'multitrack' })
  isMultitrack: boolean;

  @Column({ name: 'created_at', type: 'date' })
  created: string;

  @Column({ name: 'modified_at', type: 'date' })
  modified: string;

  @ManyToMany(() => Album)
  @JoinTable({
    name: 'albums_tracks',
    joinColumn: {
      name: 'track_id',
    },
    inverseJoinColumn: {
      name: 'album_id',
    },
  })
  albums: Album[];
}
