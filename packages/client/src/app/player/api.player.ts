import { Injectable } from '@angular/core';
import { Track } from '../dto/track';
import { API } from '../services/api.service';
import { Player } from './player';

@Injectable({
  providedIn: 'root'
})
export class ApiPlayer extends Player {
  private _timer?: number;
  private _track?: Track;
  private _lastTick: number = 0;
  private _remaining: number = 0;

  constructor(private api: API) {
    super();
  }

  async play(track: Track): Promise<void> {
    await this.api.volume({ value: this._volume });
    await this.api.playTrack(track.id);

    this._track = track;
    this._remaining = track.duration * 1000;

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

    this._lastTick = Date.now();

    this._timer = window.setInterval(() => {
      const delta = Date.now() - this._lastTick;
      this._lastTick = Date.now();

      this._remaining -= delta;

      if (this._remaining < 1000) {
        this.stopTimer();
        this._track && this.onEnd(this._track);
      }
    }, 1000);
  }

  private stopTimer() {
    this._timer && clearInterval(this._timer);
  }
}
