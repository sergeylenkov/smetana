import { Injectable } from '@angular/core';
import { PlayerAPI } from '../api/player.api';
import { Track } from '../dto/track';
import { Player } from './player';

@Injectable({
  providedIn: 'root'
})
export class ApiPlayer extends Player {
  private _timer?: number;
  private _track?: Track;
  private _lastTick: number = 0;
  private _remaining: number = 0;

  constructor(private api: PlayerAPI) {
    super();
  }

  public override get volume(): number {
    return this._volume;
  }

  public override set volume(volume: number) {
    this._volume = volume;
    this.api.volume({ value: volume });
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

  public forceStop(): void {
    this.api.forceStop();
  }

  private startTimer() {
    this.stopTimer();

    this._lastTick = Date.now();

    this._timer = window.setInterval(() => {
      const delta = Date.now() - this._lastTick;
      this._lastTick = Date.now();

      this._remaining -= delta;

      if (this._remaining >= 1000) {
        const seconds = this._remaining / 1000;
        const progress = Math.floor(seconds / (this._track!.duration / 100));

        this.onProgress(progress);
      } else {
        this.stopTimer();

        if (this._track) {
          this.stop(this._track);
          this.onEnd(this._track);
        }
      }
    }, 1000);
  }

  private stopTimer() {
    this._timer && clearInterval(this._timer);
  }
}
