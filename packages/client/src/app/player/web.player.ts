import { Howl } from 'howler';
import { Track } from '../dto/track';
import { IPlayer } from './player';

export class WebPlayer implements IPlayer {
  private _sound?: Howl;
  private _volume = 0.1;

  public set volume(value: number) {
    this._volume = value;
    this._sound && this._sound.volume(value);
  }

  public get volume(): number {
    return this._volume;
  }

  play(track: Track): void {
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
      }
    });

    this._sound.play();
  }

  stop(track: Track): void {
    this._sound && this._sound.stop();
  }

  pause(track: Track): void {
    this._sound && this._sound.pause();
  }

  resume(track: Track): void {
    this._sound && this._sound.play;
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
