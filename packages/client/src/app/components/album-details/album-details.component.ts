import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AlbumsService } from '../../services/albums.service';
import { Album } from '../../dto/album';
import { Track } from '../../dto/track';
import { PlayerService } from '../../services/player.service';
import { PlayerState } from '../../models/player';

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.scss'],
})
export class AlbumDetailsComponent implements OnInit {
  public album?: Album;
  public tracks: Track[] = [];
  public currentTrack?: Track;
  public stateType = PlayerState;

  constructor(private service: AlbumsService, private route: ActivatedRoute, private router: Router, private playerService: PlayerService) {
    this.playerService.onStart.subscribe((track: Track) => {
      this.currentTrack = this.playerService.track;
      this.album = this.playerService.album;
    });

    this.playerService.onStop.subscribe(() => {
      this.currentTrack = this.playerService.track;
      this.album = this.playerService.album;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const id = this.route.snapshot.params['id'];
        this.loadAlbum(id);
      }
    });
  }

  ngOnInit(): void {
  }

  private async loadAlbum(id: number) {
    this.currentTrack = this.playerService.track;
    this.album = this.playerService.album;

    const album = await this.service.getAlbum(id);

    this.album = album;
    this.playerService.album = this.album;

    const tracks = await this.service.getTracks(id);

    this.tracks = tracks.sort((a, b) => {
      return a.track - b.track;
    });
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
