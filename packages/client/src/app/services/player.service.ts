import { EventEmitter, Injectable } from '@angular/core';
import { API } from './api.service';
import { Album } from '../dto/album';
import { Track } from '../dto/track';
import { IPlayer } from '../player/player';
import { WebPlayer } from '../player/web.player';
import { ApiPlayer } from '../player/api.player';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  public track?: Track;
  public _album?: Album;
  public onTrackStart: EventEmitter<Track>;
  public onStop: EventEmitter<void>;
  private _playlist: Track[] = [];
  private _player: IPlayer;

  constructor(private api: API) {
    this._player = environment.useWebPlayer ? new WebPlayer() : new ApiPlayer(api);
    this._player.volume = 0.1;

    this._player.onStart = (track: Track) => {
      this.onTrackStart.emit(track);
    }

    this._player.onStop = (track: Track) => {
      this.onStop.emit();
    }

    this._player.onEnd = (track: Track) => {
      this.playNext();
    }

    this.onTrackStart = new EventEmitter();
    this.onStop = new EventEmitter();
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
