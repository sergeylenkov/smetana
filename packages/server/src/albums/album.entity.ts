import { Artist } from '../artists/artist.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

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
}
