import { EventEmitter, Injectable } from '@angular/core';
import { Album } from '../dto/album';
import { Track } from '../dto/track';
import { PlayerState } from '../models/player';
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
  private _state: PlayerState = PlayerState.Stopped;

  constructor(private player: Player) {
    this._player = player;
    this._player.volume = 0.1;

    this._player.onStart = (track: Track) => {
      this._state = PlayerState.Playing;

      this.onStart.emit(track);
    }

    this._player.onStop = () => {
      this._state = PlayerState.Stopped;

      this.onStop.emit();
    }

    this._player.onEnd = () => {
      this._state = PlayerState.Stopped;

      this.nextTrack();
    }

    this._player.onPause = () => {
      this._state = PlayerState.Paused;

      this.onPause.emit();
    }

    this._player.onResume = () => {
      this._state = PlayerState.Playing;

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

  public get isFirstTrack(): boolean {
    return this.getCurrentTrackIndex() === 0;
  }

  public get isLastTrack(): boolean {
    return this.getCurrentTrackIndex() === this._playlist.length - 1;
  }

  public get state(): PlayerState {
    return this._state;
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

  public nextTrack() {
    let index = this.getCurrentTrackIndex();

    if (index !== undefined && index < this._playlist.length - 1) {
      const nextTrack = this._playlist[++index];
      this.playTrack(nextTrack);
    }
  }

  public previousTrack() {
    let index = this.getCurrentTrackIndex();

    if (index !== undefined && index > 0) {
      const previousTrack = this._playlist[--index];
      this.playTrack(previousTrack);
    }
  }

  private getCurrentTrackIndex(): number | undefined {
    if (this.track) {
      const index = this._playlist.findIndex(item => item.id === this.track?.id);
      return index === -1 ? undefined : index;
    }

    return undefined;
  }
}
