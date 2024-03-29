import { Injectable } from '@angular/core';
import { Howl } from 'howler';
import { Track } from '../dto/track';
import { Player } from './player';

@Injectable({
  providedIn: 'root'
})
export class WebPlayer extends Player {
  private _sound?: Howl;

  public override set volume(value: number) {
    super.volume = value;
    this._sound && this._sound.volume(value);
  }

  public play(track: Track): void {
    if (this._sound) {
      this._sound.stop();
      this._sound = undefined;
    }

    const parts = track.fileName.split('.');
    const format = parts[parts.length - 1] || 'mp3';

    this._sound = new Howl({
      src: [track.url],
      format: format,
      autoplay: false,
      volume: 0.1,
      onplay: () => {
        this.onStart(track);
      },
      onloaderror: (soundId: number, error: unknown) => {
        throw new Error(error ? String(error) : 'Unknown player error');
      },
      onplayerror: (soundId: number, error: unknown) => {
        throw new Error(error ? String(error) : 'Unknown player error');
      },
      onend: () => {
        this.onEnd(track);
      },
      onpause: () => {
        this.onPause(track);
      }
    });

    this._sound.play();
  }

  public stop(track: Track): void {
    this._sound && this._sound.stop();
  }

  public pause(track: Track): void {
    this._sound && this._sound.pause();
  }

  public resume(track: Track): void {
    this._sound && this._sound.play();
  }

  public forceStop(): void {
    this._sound && this._sound.stop();
  }
}
