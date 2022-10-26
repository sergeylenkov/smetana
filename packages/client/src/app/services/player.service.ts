import { EventEmitter, Injectable } from '@angular/core';
import { Album } from '../dto/album';
import { Track } from '../dto/track';
import { Player } from '../player/player';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  public track?: Track;
  public _album?: Album;
  public onStart: EventEmitter<Track>;
  public onStop: EventEmitter<void>;
  public onPause: EventEmitter<void>;
  public onResume: EventEmitter<void>;
  private _playlist: Track[] = [];
  private _player: Player;
  private _isPlaying: boolean = false;
  private _isPaused: boolean = false;

  constructor(private player: Player) {
    this._player = player;
    this._player.volume = 0.1;

    this._player.onStart = (track: Track) => {
      this._isPlaying = true;

      this.onStart.emit(track);
    }

    this._player.onStop = () => {
      this._isPlaying = false;
      this._isPaused = false;

      this.onStop.emit();
    }

    this._player.onEnd = () => {
      this._isPlaying = false;
      this._isPaused = false;

      this.playNext();
    }

    this._player.onPause = () => {
      this._isPaused = true;
      this.onPause.emit();
    }

    this._player.onResume = () => {
      this._isPaused = false;
      this.onResume.emit();
    }

    this.onStart = new EventEmitter();
    this.onStop = new EventEmitter();
    this.onPause = new EventEmitter();
    this.onResume = new EventEmitter();
  }

  public set album(album: Album | undefined) {
    this._album = album;

    if (album) {
      this._playlist.push(...album.tracks);
    }
  }

  public get album(): Album | undefined {
    return this._album;
  }

  public set volume(volume: number) {
    this._player.volume = volume;
  }

  public get volume(): number {
    return this._player.volume;
  }

  public get isPlaying(): boolean {
    return this._isPlaying;
  }

  public get isPaused(): boolean {
    return this._isPaused;
  }

  public playTrack(track: Track) {
    console.log(track);
    this.track = track;
    this._player.play(track);
  }

  public pause() {
    this.track && this._player.pause(this.track);
  }

  public stop() {
    this.track && this._player.stop(this.track);
    this.track = undefined;
  }

  public resume() {
    this.track && this._player.resume(this.track);
  }

  private playNext() {
    if (this.track) {
      let index = this._playlist.findIndex(item => item.id === this.track?.id);

      if (index !== -1 && index < this._playlist.length - 1) {
        index = index + 1;
        const nextTrack = this._playlist[index];

        this.playTrack(nextTrack);
      }
    }
  }
}
