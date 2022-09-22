import { EventEmitter, Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { Album } from './dto/album';
import { Track } from './dto/track';

@Injectable({
  providedIn: 'root',
 })
export class PlayerService {
  public track?: Track;
  public _album?: Album;
  public onTrackStart: EventEmitter<Track>;
  public onTrackEnded: Observable<Event>;
  public onStop: EventEmitter<void>;
  private _audio: HTMLAudioElement;
  private _playlist: Track[] = [];

  constructor() {
    this._audio = document.createElement('audio');
    this.volume = 0.2;

    this.onTrackStart = new EventEmitter();
    this.onTrackEnded = fromEvent(this._audio, 'ended');
    this.onStop = new EventEmitter();

    this.onTrackEnded.subscribe(() => {
      this.playNext();
    })
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

  public playTrack(track: Track) {
    this.track = track;

    this._audio.setAttribute('src', track.url);
    this._audio.play();

    this.onTrackStart.emit(track);
  }

  public stop() {
    this._audio.pause();
    this.track = undefined;

    this.onStop.emit();
  }

  public set volume(volume: number) {
    this._audio.volume = volume;
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
