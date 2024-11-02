import { Component, OnInit } from '@angular/core';
import { Genre } from '../../dto/genre';
import { GenresService } from '../../services/genres.service';
import { PlayerService } from '../../services/player.service';
import { PlayerState } from '../../models/player';
import { Track } from '../../dto/track';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss'],
  providers: [GenresService],
})
export class GenresComponent implements OnInit {
  private _onStart?: Subscription;
  private _onStop?: Subscription;
  public genres: Genre[] = [];
  public stateType = PlayerState;
  public currentGenre?: Genre;

  constructor(private service: GenresService, private playerService: PlayerService) {}

  ngOnInit(): void {
    this._onStart = this.playerService.onStart.subscribe((track: Track) => {
      this.loadAlbumForTrack(track);
    });

    this._onStop = this.playerService.onStop.subscribe(() => {
      //
    });

    this.getGenres();
  }

  ngOnDestroy(): void {
    this._onStart && this._onStart.unsubscribe();
    this._onStop && this._onStop.unsubscribe();
  }

  private async loadTracks(id: number) {
    const tracks = await this.service.getTracks(id);

    tracks.sort((a, b) => {
      return Math.random() - 0.5;
    });

    this.playerService.genre = this.currentGenre;
    this.playerService.tracks = tracks;
    this.playerService.playTrack(tracks[0]);
  }

  private async loadAlbumForTrack(track: Track) {
    const albums = await this.service.getTrackAlbums(track.id);
    this.playerService.album = albums[0];
  }

  public async getGenres() {
    const genres = await this.service.getGenres();

    this.genres = genres.sort((a, b) => {
      return b.tracksCount - a.tracksCount;
    });
  }

  public getGenreState(id: number): PlayerState {
    if (this.isActive(id)) {
      return this.playerService.state;
    }

    return PlayerState.Stopped;
  }

  public onPlayGenre(id: number) {
    this.currentGenre = this.genres.find(genre => genre.id == id);
    this.loadTracks(id);
  }

  public onPauseGenre() {
    this.playerService.pause();
  }

  public onResumeGenre() {
    this.playerService.resume();
  }

  public isActive(id: number) {
    return this.currentGenre && this.currentGenre.id === id
  }
}
