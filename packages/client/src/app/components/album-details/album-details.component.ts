import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumsService } from '../../services/albums.service';
import { Album } from '../../dto/album';
import { Track } from '../../dto/track';
import { PlayerService } from '../../services/player.service';
import { PlayerState } from 'src/app/models/player';

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.scss'],
})
export class AlbumDetailsComponent implements OnInit {
  public album?: Album;
  public currentTrack?: Track;
  public stateType = PlayerState;

  constructor(private service: AlbumsService, private route: ActivatedRoute, private playerService: PlayerService) {
    this.playerService.onStart.subscribe((track: Track) => {
      this.currentTrack = this.playerService.track;
      this.album = this.playerService.album;
    });

    this.playerService.onStop.subscribe(() => {
      this.currentTrack = this.playerService.track;
      this.album = this.playerService.album;
    });
  }

  ngOnInit(): void {
    this.currentTrack = this.playerService.track;
    this.album = this.playerService.album;

    const id = this.route.snapshot.params['id'];
    this.getTracks(id);
  }

  private async getTracks(id: number) {
    const album = await this.service.getTracks(id);

    if (album) {
      album.tracks.sort((a, b) => {
        return a.track - b.track;
      })

      this.album = album;
      this.playerService.album = this.album;
    }
  }

  public getTrackState(id: number): PlayerState {
    if (this.currentTrack && this.currentTrack.id === id) {
      return this.playerService.state;
    }

    return PlayerState.Stopped;
  }

  public onPlayTrack(id: number) {
    const track = this.album?.tracks.find((item) => {
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
