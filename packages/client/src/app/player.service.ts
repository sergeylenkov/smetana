import { EventEmitter, Injectable } from '@angular/core';
import { Howl, SoundSpriteDefinitions } from 'howler';
import { Album } from './dto/album';
import { Track } from './dto/track';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  public track?: Track;
  public _album?: Album;
  public onTrackStart: EventEmitter<Track>;
  public onStop: EventEmitter<void>;
  private _playlist: Track[] = [];
  private _sound?: Howl;
  private _volume: number = 0;

  constructor() {
    this._volume = 0.1;

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
    this._volume = volume;

    if (this._sound) {
      this._sound.volume(this._volume);
    }
  }

  public set time(time: number) {
    console.log(time);
  }

  public playTrack(track: Track) {
    if (this._sound) {
      this._sound.stop();
      this._sound = undefined;
    }

    this.track = track;
    console.log(track);

    const parts = track.fileName.split('.');
    const format = parts[parts.length - 1] || 'mp3';
    let sprite: SoundSpriteDefinitions | undefined;

    if (track.isMultitrack) {
      const start = track.start * 1000;
      const duration = track.start * 1000;

      sprite = { track: [start, start + duration] };
    }

    this._sound = new Howl({
      src: [track.url],
      format: format,
      autoplay: false,
      volume: this._volume,
      sprite: sprite,
      onplay: () => {
        this.onTrackStart.emit(track);
      },
      onloaderror: () => {
        console.log('onloaderror');
      },
      onplayerror: () => {
        console.log('onplayerror');
      },
      onend: () => {
        console.log('onend!');
        this.playNext();
      }
    });

    track.isMultitrack ? this._sound.play('track') : this._sound.play();
  }

  public pause() {
    this._sound?.pause();
    this.onStop.emit();
  }

  public stop() {
    this._sound?.stop();
    this.track = undefined;

    this.onStop.emit();
  }

  public resume() {
    this._sound?.play();
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
