import { EventEmitter, Injectable } from '@angular/core';
import { Album } from '../dto/album';
import { Track } from '../dto/track';
import { PlayerState } from '../models/player';
import { Player } from '../player/player';
import { SettingsService } from './settings.service';

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
  public onEnd: EventEmitter<void>;
  public onProgress: EventEmitter<number>;
  private _playlist: Track[] = [];
  private _state: PlayerState = PlayerState.Stopped;

  constructor(private player: Player, private settings: SettingsService) {
    this.player.volume = settings.volume;

    this.player.onStart = (track: Track) => {
      this._state = PlayerState.Playing;
      this.onStart.emit(track);
    }

    this.player.onStop = () => {
      this._state = PlayerState.Stopped;
      this.onStop.emit();
    }

    this.player.onEnd = () => {
      this._state = PlayerState.Stopped;
      this.nextTrack();

      this.onEnd.emit();
    }

    this.player.onPause = () => {
      this._state = PlayerState.Paused;

      this.onPause.emit();
    }

    this.player.onResume = () => {
      this._state = PlayerState.Playing;

      this.onResume.emit();
    }

    this.player.onProgress = (progress) => {
      this.onProgress.emit(progress);
    }

    this.onStart = new EventEmitter();
    this.onStop = new EventEmitter();
    this.onPause = new EventEmitter();
    this.onResume = new EventEmitter();
    this.onEnd = new EventEmitter();
    this.onProgress = new EventEmitter();
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
    this.player.volume = volume;
    this.settings.volume = volume;
  }

  public get volume(): number {
    return this.player.volume;
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
    this.player.play(track);
  }

  public pause() {
    this.track && this.player.pause(this.track);
  }

  public stop() {
    this.track && this.player.stop(this.track);
    this.track = undefined;
  }

  public resume() {
    this.track && this.player.resume(this.track);
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

  public forceStop() {
    this.player.forceStop();
  }

  private getCurrentTrackIndex(): number | undefined {
    if (this.track) {
      const index = this._playlist.findIndex(item => item.id === this.track?.id);
      return index === -1 ? undefined : index;
    }

    return undefined;
  }
}
