import { Component, OnInit } from '@angular/core';
import { Genre } from '../../dto/genre';
import { GenresService } from '../../services/genres.service';
import { PlayerService } from '../../services/player.service';
import { PlayerState } from 'src/app/models/player';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss'],
  providers: [GenresService],
})
export class GenresComponent implements OnInit {
  public genres: Genre[] = [];
  public stateType = PlayerState;
  public currentGenre?: Genre;

  constructor(private service: GenresService, private playerService: PlayerService) {}

  ngOnInit(): void {
    this.getGenres();
  }

  private async loadTracks(id: number) {
    const tracks = await this.service.getTracks(id);

    this.currentGenre = this.genres.find(genre => genre.id == id);
    this.playerService.genre = this.currentGenre;
    this.playerService.tracks = tracks;
    this.playerService.playTrack(tracks[0]);
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
