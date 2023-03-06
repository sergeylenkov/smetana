import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AlbumsService } from '../../services/albums.service';
import { Album } from '../../dto/album';
import { Track } from '../../dto/track';
import { PlayerService } from '../../services/player.service';
import { PlayerState } from '../../models/player';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.scss'],
})
export class AlbumDetailsComponent implements OnInit, OnDestroy {
  public album?: Album;
  public tracks: Track[] = [];
  public currentTrack?: Track;
  public stateType = PlayerState;
  private _onStart?: Subscription;
  private _onStop?: Subscription;

  constructor(private service: AlbumsService, private route: ActivatedRoute, private router: Router, private playerService: PlayerService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const id = this.route.snapshot.params['id'];
        this.loadAlbum(id);
      }
    });
  }

  ngOnInit(): void {
    this._onStart = this.playerService.onStart.subscribe((track: Track) => {
      this.currentTrack = this.playerService.track;
      this.album = this.playerService.album;
    });

    this._onStop = this.playerService.onStop.subscribe(() => {
      this.currentTrack = this.playerService.track;
      this.album = this.playerService.album;
    });
  }

  ngOnDestroy(): void {
    this._onStart && this._onStart.unsubscribe();
    this._onStop && this._onStop.unsubscribe();
  }

  private async loadAlbum(id: number) {
    this.currentTrack = this.playerService.track;

    this.album = await this.service.getAlbum(id);
    const tracks = await this.service.getTracks(id);

    this.tracks = tracks.sort((a, b) => {
      return a.track - b.track;
    });

    this.playerService.album = this.album;
    this.playerService.tracks = tracks;
  }

  public getTrackState(id: number): PlayerState {
    if (this.currentTrack && this.currentTrack.id === id) {
      return this.playerService.state;
    }

    return PlayerState.Stopped;
  }

  public onPlayTrack(id: number) {
    const track = this.tracks.find((item) => {
      return item.id === id;
    })

    if (track) {
      this.playerService.playTrack(track);
    }
  }

  public onPauseTrack() {
    this.playerService.pause();
  }

  public onResumeTrack() {
    this.playerService.resume();
  }
}
