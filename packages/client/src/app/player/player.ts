import { Track } from '../dto/track';

export abstract class Player {
  protected _volume: number = 0;

  public set volume(value: number) {
    this._volume = value;
  }

  public get volume(): number {
    return this._volume;
  }

  abstract play(track: Track): void;
  abstract stop(track: Track): void;
  abstract pause(track: Track): void;
  abstract resume(track: Track): void;
  abstract forceStop(): void;

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

  onProgress(progress: number) {
    throw new Error('Method not implemented.');
  };
}
