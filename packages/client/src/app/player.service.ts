import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { Track } from './dto/track';

@Injectable({
  providedIn: 'root',
 })
export class PlayerService {
  private _audio: HTMLAudioElement;
  public currentTrack?: Track;
  public onTrackEnded: Observable<Event>;

  constructor() {
    this._audio = document.createElement('audio');
    this.onTrackEnded = fromEvent(this._audio, 'ended');
  }

  public playTrack(track: Track) {
    this.currentTrack = track;

    this._audio.setAttribute('src', track.url);
    this._audio.play();
  }

  public stop() {
    this._audio.pause();
  }

  public setVolume(volume: number) {
    this._audio.volume = volume;
  }
}
