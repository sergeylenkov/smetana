import { Component, Input, OnInit } from '@angular/core';
import { SearchTrack } from '../../dto/search-track';

@Component({
  selector: 'app-search-track',
  templateUrl: './search-track.component.html',
  styleUrls: ['./search-track.component.scss']
})
export class SearchTrackComponent implements OnInit {
  @Input() track?: SearchTrack;
  public artists: string = '';

  ngOnInit(): void {
    if (this.track) {
      this.artists = this.track.album.artists.join(', ');
    }
  }
}
