import { Artist } from 'src/artists/artist.entity';
import { Album } from '../albums/album.entity';
import { Track } from '../tracks/track.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'statistics', synchronize: false })
export class Statistics {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Track)
  @JoinColumn({ name: 'track_id' })
  track: Track;

  @OneToOne(() => Album)
  @JoinColumn({ name: 'album_id' })
  album: Album;

  @OneToOne(() => Artist)
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @Column({ name: 'favorite', default: false })
  isFavorite: boolean;

  @Column({ name: 'plays_count' })
  playsCount: number;

  @Column({ name: 'last_played_time', type: 'date' })
  lastPlayedTime: string;
}
