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

  @Column({ name: 'favorite', default: false })
  isFavorite: boolean;

  @Column({ name: 'plays_count' })
  playsCount: number;

  @Column({ name: 'last_played_time', type: 'date' })
  lastPlayedTime: string;
}
