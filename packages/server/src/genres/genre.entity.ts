import { Track } from '../tracks/track.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity({ name: 'genres', synchronize: false })
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Track)
  @JoinTable({
    name: 'genres_tracks',
    joinColumn: {
      name: 'genre_id',
    },
    inverseJoinColumn: {
      name: 'track_id',
    },
  })
  tracks: Track[];

  tracksCount: number;
}
