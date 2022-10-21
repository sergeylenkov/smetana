import { Track } from '../dto/track';
import { API } from '../services/api.service';
import { IPlayer } from './player';

export class ApiPlayer implements IPlayer {
  private _volume = 0.1;

  constructor(private api: API) {
  }

  public set volume(value: number) {
    this._volume = value;
  }

  public get volume(): number {
    return this._volume;
  }

  async play(track: Track): Promise<void> {
    await this.api.volume({ value: this._volume });
    await this.api.playTrack(track.id);

    this.onStart(track);
  }

  stop(track: Track): void {
    this.api.stopTrack(track.id).then(() => {
      this.onStop(track);
    });
  }

  pause(track: Track): void {
    this.api.pauseTrack(track.id).then(() => {
      this.onStop(track);
    });
  }

  resume(track: Track): void {
    this.api.playTrack(track.id).then(() => {
      this.onStart(track);
    });
  }

  onStart(track: Track) {
    throw new Error('Method not implemented.');
  };

  onStop(track: Track) {
    throw new Error('Method not implemented.');
  };

  onEnd(track: Track) {
    throw new Error('Method not implemented.');
  };
}
