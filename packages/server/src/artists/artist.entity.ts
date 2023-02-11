import { Album } from '../albums/album.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity({ name: 'artists', synchronize: false })
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Album)
  @JoinTable({
    name: 'artists_albums',
    joinColumn: {
      name: 'artist_id',
    },
    inverseJoinColumn: {
      name: 'album_id',
    },
  })
  albums: Album[];
}
