import { Track } from '../dto/track';
import { API } from '../services/api.service';
import { IPlayer } from './player';

export class ApiPlayer implements IPlayer {
  private _volume = 0.1;
  private _timer?: number;
  private _remaining: number = 0;
  private _track?: Track;

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

    this._remaining = track.duration;
    this._track = track;

    this.onStart(track);
    this.startTimer();
  }

  public stop(track: Track): void {
    this.api.stopTrack(track.id).then(() => {
      this.stopTimer();
      this.onStop(track);
    });
  }

  public pause(track: Track): void {
    this.api.pauseTrack(track.id).then(() => {
      this.stopTimer();
      this.onPause(track);
    });
  }

  public resume(track: Track): void {
    this.api.resumeTrack(track.id).then(() => {
      this.startTimer();
      this.onResume(track);
    });
  }

  private startTimer() {
    this.stopTimer();

    this._timer = window.setInterval(() => {
      this._remaining -= 1;

      if (this._remaining <= 0) {
        this._track && this.onEnd(this._track);
      }
    }, 1000);
  }

  private stopTimer() {
    this._timer && clearInterval(this._timer);
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

  onPause(track: Track) {
    throw new Error('Method not implemented.');
  };

  onResume(track: Track) {
    throw new Error('Method not implemented.');
  };
}
