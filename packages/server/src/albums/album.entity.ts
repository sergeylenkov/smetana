import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Artist } from '../artists/artist.entity';
import { Genre } from '../genres/genre.entity';
import { Cover } from '../cover/cover.entity';
import { Track } from '../tracks/track.entity';

@Entity({ name: 'albums', synchronize: false })
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  year: number;

  @ManyToMany(() => Artist)
  @JoinTable({
    name: 'artists_albums',
    joinColumn: {
      name: 'album_id',
    },
    inverseJoinColumn: {
      name: 'artist_id',
    },
  })
  artists: Artist[];

  @ManyToMany(() => Genre)
  @JoinTable({
    name: 'genres_albums',
    joinColumn: {
      name: 'album_id',
    },
    inverseJoinColumn: {
      name: 'genre_id',
    },
  })
  genres: Genre[];

  @ManyToMany(() => Cover)
  @JoinTable({
    name: 'covers_albums',
    joinColumn: {
      name: 'album_id',
    },
    inverseJoinColumn: {
      name: 'cover_id',
    },
  })
  covers: Cover[];

  @ManyToMany(() => Track)
  @JoinTable({
    name: 'albums_tracks',
    joinColumn: {
      name: 'album_id',
    },
    inverseJoinColumn: {
      name: 'track_id',
    },
  })
  tracks: Track[];
}
