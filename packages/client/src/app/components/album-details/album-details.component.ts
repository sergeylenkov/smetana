import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumsService } from '../../services/albums.service';
import { Album } from '../../dto/album';
import { Track } from '../../dto/track';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.scss']
})
export class AlbumDetailsComponent implements OnInit {
  public album?: Album;
  public currentTrack?: Track;

  constructor(private service: AlbumsService, private route: ActivatedRoute, private playerService: PlayerService) {
    playerService.onStart.subscribe((track: Track) => {
      this.currentTrack = playerService.track;
      this.album = playerService.album;
    });

    playerService.onStop.subscribe(() => {
      this.currentTrack = playerService.track;
      this.album = playerService.album;
    });

    playerService.onPause.subscribe(() => {
      //.isPaused = false;
    });

    playerService.onResume.subscribe(() => {
      //this.isPaused = false;
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

  public isPlaying(id: number): boolean {
    if (this.currentTrack && this.currentTrack.id === id && this.playerService.isPlaying) {
      return true;
    }

    return false;
  }

  public isPaused(id: number): boolean {
    if (this.currentTrack && this.currentTrack.id === id && this.playerService.isPaused) {
      return true;
    }

    return false;
  }

  public playTrack(id: number) {
    const track = this.album?.tracks.find((item) => {
      return item.id === id;
    })

    if (track) {
      this.playerService.playTrack(track);
    }
  }

  public pauseTrack() {
    console.log('pause');
    this.playerService.pause();
  }

  public resumeTrack() {
    console.log('pause');
    this.playerService.resume();
  }
}
