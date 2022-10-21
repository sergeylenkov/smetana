import { Track } from '../dto/track';

export interface IPlayer {
  volume: number;

  play(track: Track): void;
  stop(track: Track): void;
  pause(track: Track): void;
  resume(track: Track): void;

  onStart: (track: Track) => void;
  onStop: (track: Track) => void;
  onEnd: (track: Track) => void;
}
